import json
import os
from dataclasses import dataclass
from enum import Enum
from typing import Any, Dict, List, Literal, TypedDict

from dotenv import load_dotenv
from IPython.display import Image
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from pydantic import BaseModel, Field
from typing_extensions import TypedDict

load_dotenv()


# Data Models
class VoteDecision(str, Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    ABSTAIN = "ABSTAIN"


class ValidationResult(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"

class FinalDecision(BaseModel):
    decision: Literal["APPROVE", "REJECT"]
    justification: str = Field(description="A brief explanation of the decision")


@dataclass
class DAOInfo:
    name: str
    description: str
    objective: str
    values: str

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "objective": self.objective,
            "values": self.values,
        }


@dataclass
class Proposal:
    title: str
    description: str
    amount: float
    additional_context: Dict[str, Any] = None

    def to_dict(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "amount": self.amount,
            "additional_context": self.additional_context,
        }


# State Management
class AgentState(TypedDict):
    proposal: Dict[str, Any]
    dao_info: Dict[str, str]
    discussion_history: List[str]
    votes: Dict[str, str]
    final_decision: Dict[str, str]
    vote_counts: Dict[str, int]


# Add these new models near the top with other data models
class VoteResult(BaseModel):
    vote: Literal["APPROVE", "REJECT", "ABSTAIN"]
    explanation: str = Field(description="Brief explanation for the vote")


class PrecheckResult(BaseModel):
    status: Literal["PASS", "FAIL"]
    risk_level: Literal["LOW", "MEDIUM", "HIGH"]
    issues: List[str] = Field(description="List of major issues if any")
    proceed_to_review: bool
    explanation: str = Field(description="Brief explanation of decision")


# Agent Definitions
class BaseAgent:

    def __init__(self, role: str, description: str, prompts: List[str] = None):
        self.role = role
        self.description = description
        self.prompts = prompts or []
        self.llm = ChatOpenAI(
            model=os.getenv("LLM_MODEL"),
            temperature=0,
            base_url=os.getenv("LLM_BASE_URL"),
            api_key=os.getenv("LLM_API_KEY"),
        )

    def get_analysis_prompt(self) -> ChatPromptTemplate:
        messages = [
            (
                "system",
                f"""You are a {self.role} in the AI Agent Committee.

Role Description:
{self.description}

DAO Information:
Name: {dao_info.name}
Description: {dao_info.description}
Objective: {dao_info.objective}
Values: {dao_info.values}

As an agent of this DAO, you must ensure all decisions align with the DAO's objective and values.

Guidelines:
1. Keep your analysis brief and focused - maximum 2-3 sentences
2. Only mention NEW concerns or points not raised in previous discussions
3. If you have nothing new to add, respond with: PASS
4. Focus only on your role's perspective
5. Ensure recommendations align with DAO values and objectives""",
            )
        ]

        # Add each custom prompt as an AI message
        if self.prompts:
            for prompt in self.prompts:
                messages.append(("human", prompt))

        messages.append(
            (
                "human",
                """Review the proposal and previous discussions:

Proposal:
{proposal}

Previous discussions:
{discussion_history}

Provide your brief analysis or respond with PASS if no new concerns.""",
            )
        )

        return ChatPromptTemplate.from_messages(messages)

    def analyze(self, state: AgentState) -> AgentState:
        prompt = self.get_analysis_prompt()
        messages = prompt.format_messages(
            proposal=json.dumps(state["proposal"], indent=2),
            discussion_history="\n".join(state["discussion_history"]),
            dao_info=state["dao_info"],
        )
        response = self.llm.invoke(messages)

        if "PASS" not in response.content:
            state["discussion_history"].append(f"{self.role}: {response.content}")

        return state

    def vote(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    f"""You are the {self.role} in the AI Agent Committee. Based on the DAO's objectives and values, 
                and your role's perspective, you must vote on the proposal.""",
                ),
                (
                    "human",
                    """Based on all discussions and your role's perspective, cast your vote on the proposal.

Full discussion history:
{discussion_history}

Proposal:
{proposal}

Cast your vote as APPROVE, REJECT, or ABSTAIN with a brief explanation.""",
                ),
            ]
        )

        messages = prompt.format_messages(
            discussion_history="\n".join(state["discussion_history"]),
            proposal=json.dumps(state["proposal"], indent=2),
        )

        response = self.llm.with_structured_output(VoteResult).invoke(messages)
        state["votes"][self.role] = response.vote

        return state


class VoteCounter:
    def count_votes(self, state: AgentState) -> AgentState:
        approve_count = sum(1 for vote in state["votes"].values() if vote == "APPROVE")
        reject_count = sum(1 for vote in state["votes"].values() if vote == "REJECT")

        # Store vote counts in state
        state["vote_counts"] = {"approve": approve_count, "reject": reject_count}

        # Make final decision based on majority vote
        majority_decision = "APPROVE" if approve_count > reject_count else "REJECT"
        justification = (
            f"Based on majority vote (Approve: {approve_count}, Reject: {reject_count})"
        )

        state["final_decision"] = FinalDecision(
            decision=majority_decision, justification=justification
        ).model_dump()

        return state


def create_dynamic_workflow(agents_config: List[Dict[str, Any]]) -> StateGraph:
    if not agents_config:
        raise ValueError("agents_config is empty")
    workflow = StateGraph(AgentState)

    # Create agent instances
    agents = {}
    for config in agents_config:
        agent = BaseAgent(
            role=config["role"],
            description=f"Agent for {config['role']}",
            prompts=config.get("prompts", []),
        )
        agents[config["id"]] = agent

        # Add node for analysis phase
        workflow.add_node(config["id"], agent.analyze)
        # Add node for voting phase
        workflow.add_node(f"{config['id']}_vote", agent.vote)

    # Set entry point to the first agent
    workflow.set_entry_point(agents_config[0]["id"])

    # Connect analysis nodes based on the next relationships
    for config in agents_config:
        for next_id in config["nexts"]:
            workflow.add_edge(config["id"], next_id)

    # Connect last analysis node to first voting node
    last_analysis_node = None
    for config in agents_config:
        if not config["nexts"]:  # This is the last analysis node
            last_analysis_node = config["id"]

    if last_analysis_node:
        # Connect last analysis to first voting node
        workflow.add_edge(last_analysis_node, f"{agents_config[0]['id']}_vote")

    # Connect voting nodes in sequence
    for i, config in enumerate(agents_config):
        if i < len(agents_config) - 1:
            workflow.add_edge(
                f"{config['id']}_vote", f"{agents_config[i+1]['id']}_vote"
            )
        else:
            workflow.add_edge(f"{config['id']}_vote", "count_votes")

    # Add vote counting node and connect to END
    vote_counter = VoteCounter()
    workflow.add_node("count_votes", vote_counter.count_votes)
    workflow.add_edge("count_votes", END)

    return workflow.compile()


class AIAgentCommitee:

    def __init__(self, agents_config: List[Dict[str, Any]]):
        self.agents_config = agents_config
        self.graph = create_dynamic_workflow(agents_config)

    def review_proposal(self, proposal: Proposal, dao_info: DAOInfo) -> AgentState:
        initial_state = AgentState(
            proposal=proposal.to_dict(),
            dao_info=dao_info.to_dict(),
            discussion_history=[],
            votes={},
            final_decision=FinalDecision(
                decision="REJECT", justification="No votes cast"
            ).model_dump(),
            vote_counts={"approve": 0, "reject": 0},
        )

        last_state = None
        for state in self.graph.stream(initial_state, stream_mode="values"):
            last_state = state

        return last_state


if __name__ == "__main__":
    # Example of using the dynamic configuration
    agents_config = [
        {
            "id": "coordinator",
            "role": "Proposal Coordinator",
            "prompts": [
                "Coordinate and manage proposal flow",
                "Ensure proper documentation",
            ],
            "nexts": ["financial"],
        },
        {
            "id": "financial",
            "role": "Financial Controller",
            "prompts": ["Review financial implications", "Assess budget impact"],
            "nexts": ["auditor"],
        },
        {
            "id": "technical",
            "role": "Technical Advisor",
            "prompts": [
                "Evaluate technical feasibility",
                "Assess implementation risks",
            ],
            "nexts": [],
        },
        {
            "id": "auditor",
            "role": "Chief Auditor",
            "prompts": ["Ensure compliance", "Final risk assessment"],
            "nexts": ["technical"],
        },
    ]
    dao_info = DAOInfo(
        name="Research DAO",
        description="A decentralized organization focused on advancing blockchain technology through funded research initiatives",
        objective="To advance the field of blockchain technology by funding and coordinating innovative research projects and academic collaborations",
        values="1. Scientific Rigor\n2. Open Source Collaboration\n3. Academic Excellence\n4. Innovation Focus\n5. Research Reproducibility",
    )

    test_proposal = Proposal(
        title="Pilot Implementation of Secure LLM Analytics Dashboard with Training Program",
        description="Develop a secure, maintainable MVP dashboard for LLM usage analytics with comprehensive training and support infrastructure.",
        amount=52000.00,
        additional_context={
            "timeline": "3 months",
            "team_size": 1,
            "expected_outcomes": [
                "Basic dashboard showing daily/weekly LLM API usage patterns",
                "Simple cost tracking and reporting functionality",
                "Basic error rate monitoring",
                "Usage patterns by endpoint/application",
                "Comprehensive documentation and training materials",
            ],
            "risk_mitigation": {
                "technical": "Using established open-source monitoring libraries and cloud-native solutions",
                "financial": "Fixed-price engagement with clear deliverables",
                "compliance": {
                    "data_privacy": "Implemented data anonymization and encryption at rest",
                    "access_control": "Role-based access with audit logging",
                    "retention": "Configurable data retention policies",
                    "backup": "Automated daily backups with 30-day retention",
                },
                "operational": {
                    "incident_response": "Defined escalation procedures and SLAs",
                    "maintenance_window": "Scheduled weekly maintenance slots",
                    "rollback": "Automated rollback procedures for deployments",
                },
            },
            "success_metrics": {
                "performance": "Dashboard refresh rate under 5 minutes",
                "reliability": "99% dashboard uptime",
                "cost_efficiency": "Implementation cost recovered through 10% API cost reduction in first 6 months",
                "adoption": "Dashboard actively used by at least 3 teams",
                "training": "90% user satisfaction rate post-training",
            },
            "phased_implementation": [
                "Week 1-2: Requirements gathering and security-first design",
                "Week 3-5: Core dashboard development with security features",
                "Week 6-8: Testing and security audit",
                "Week 9-10: Training program development and documentation",
                "Week 11-12: Pilot deployment and supervised usage",
            ],
            "support_and_maintenance": {
                "training": {
                    "initial": "2 structured training sessions for all users",
                    "materials": "Video tutorials and comprehensive user guide",
                    "ongoing": "Monthly office hours for Q&A",
                },
                "post_deployment": {
                    "support_hours": "Business hours support for first 3 months",
                    "feedback": "Monthly user feedback surveys and improvement cycles",
                    "maintenance": "Weekly scheduled maintenance window",
                    "monitoring": "24/7 automated system health checks",
                },
                "contingency_plans": {
                    "data_issues": "Automated data validation and corruption detection",
                    "system_failure": "Hot-standby backup instance",
                    "integration": "Fallback endpoints and graceful degradation",
                },
            },
        },
    )

    committee = AIAgentCommitee(agents_config)
    final_state = committee.review_proposal(test_proposal, dao_info)
    # Export final state to JSON
    with open("final_state.json", "w") as f:
        json.dump(final_state, f, indent=4, default=str)
    print(f"{final_state}")
