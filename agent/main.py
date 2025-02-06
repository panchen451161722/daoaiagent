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
    current_round: int
    discussion_history: List[str]
    votes: Dict[str, str]
    next_agent: str
    validation_results: Dict[str, Dict[str, Any]]
    max_rounds: int
    final_decision: FinalDecision
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

    def __init__(self, role: str, description: str):
        self.role = role
        self.description = description
        self.llm = ChatOpenAI(
            model=os.getenv("MODEL"),
            temperature=0,
            base_url=os.getenv("BASE_URL"),
            api_key=os.getenv("OPENAI_API_KEY"),
        )

    def get_prompt(self, round_num: int, max_rounds: int) -> ChatPromptTemplate:
        return ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    f"""You are a {self.role} in the AI Agent Committee with the following responsibilities:
{self.description}

Current discussion round: {round_num}/{max_rounds}

Guidelines:
1. Keep your analysis brief and focused - maximum 2-3 sentences
2. Only mention NEW concerns or points not raised in previous discussions
3. If you have nothing new to add, respond with: PASS
4. Focus only on your role's perspective""",
                ),
                (
                    "human",
                    """Review the proposal and previous discussions:

Proposal:
{proposal}

Previous discussions:
{discussion_history}

Provide your brief analysis or respond with PASS if no new concerns.""",
                ),
            ]
        )

    def analyze(self, state: AgentState) -> AgentState:
        prompt = self.get_prompt(state["current_round"], state["max_rounds"])
        messages = prompt.format_messages(
            proposal=json.dumps(state["proposal"], indent=2),
            discussion_history="\n".join(state["discussion_history"]),
        )
        response = self.llm.invoke(messages)

        # Check if response is PASS
        if "PASS" in response.content:
            # Skip adding to discussion history if PASS
            pass
        else:
            state["discussion_history"].append(
                f"Round {state['current_round']} - {self.role}: {response.content}"
            )

        # Determine next agent
        agents = ["coordinator", "financial", "technical", "auditor"]
        current_idx = agents.index(state["next_agent"])
        next_idx = (current_idx + 1) % len(agents)
        state["next_agent"] = agents[next_idx]

        if state["next_agent"] == "coordinator":
            state["current_round"] += 1

        return state

    def vote(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", f"You are the {self.role} in the AI Agent Committee."),
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


class ProposalCoordinator(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Proposal Coordinator",
            description="Responsible for proposal routing, prioritization, and ensuring proper format and completeness.",
        )


class ChiefAuditor(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Chief Auditor",
            description="Final veto authority, responsible for overall compliance and risk assessment.",
        )

    def make_final_decision(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are the Chief Auditor with veto power. You can only REJECT a proposal 
            if you find serious compliance or risk issues. You CANNOT approve a proposal directly - 
            the proposal's approval depends on the majority vote from all committee members.""",
                ),
                (
                    "human",
                    """Review all discussions and determine if you need to exercise your veto power.
                
Full discussion history:
{discussion_history}

Votes from committee members:
{votes}

Vote counts:
Approve: {approve_count}
Reject: {reject_count}

Proposal:
{proposal}

If you find any serious compliance or risk issues, exercise your veto power by responding with REJECT.
Otherwise, respect the majority vote decision.
""",
                ),
            ]
        )

        messages = prompt.format_messages(
            discussion_history="\n".join(state["discussion_history"]),
            votes=json.dumps(state["votes"], indent=2),
            approve_count=state["vote_counts"]["approve"],
            reject_count=state["vote_counts"]["reject"],
            proposal=json.dumps(state["proposal"], indent=2),
        )

        auditor_decision = self.llm.with_structured_output(FinalDecision).invoke(
            messages
        )

        # If auditor doesn't veto (REJECT), use majority vote decision
        if auditor_decision.decision != "REJECT":
            majority_decision = (
                "APPROVE"
                if state["vote_counts"]["approve"] > state["vote_counts"]["reject"]
                else "REJECT"
            )
            justification = f"Based on majority vote (Approve: {state['vote_counts']['approve']}, Reject: {state['vote_counts']['reject']})"
            state["final_decision"] = FinalDecision(
                decision=majority_decision, justification=justification
            )
        else:
            # If auditor vetoes, use their decision and justification
            state["final_decision"] = auditor_decision

        return state


class FinancialController(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Financial Controller",
            description="Responsible for budget enforcement and financial risk assessment.",
        )


class TechnicalAdvisor(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Technical Advisor",
            description="Responsible for technical risk assessment and implementation feasibility.",
        )


class ProposalChecker(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Proposal Checker",
            description="Responsible for initial proposal validation and quick risk assessment.",
        )

    def precheck(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are the Proposal Checker. Do a quick validation of the proposal.",
                ),
                (
                    "human",
                    """Do a quick check of the following proposal:
{proposal}

Check for:
1. Basic format and completeness
2. Quick feasibility assessment
3. Major red flags or risks

Provide your assessment including status (PASS/FAIL), risk level (LOW/MEDIUM/HIGH), any major issues, whether to proceed with review, and a brief explanation.""",
                ),
            ]
        )

        messages = prompt.format_messages(
            proposal=json.dumps(state["proposal"], indent=2)
        )
        result = self.llm.with_structured_output(PrecheckResult).invoke(messages)
        state["validation_results"]["precheck"] = result.model_dump()
        state["next_agent"] = "coordinator" if result.proceed_to_review else END
        return state


class VoteCounter:
    def count_votes(self, state: AgentState) -> AgentState:
        approve_count = sum(1 for vote in state["votes"].values() if vote == "APPROVE")
        reject_count = sum(1 for vote in state["votes"].values() if vote == "REJECT")

        # Store vote counts in state
        state["vote_counts"] = {"approve": approve_count, "reject": reject_count}

        return state


def create_aiac_graph():
    # Initialize agents
    checker = ProposalChecker()
    coordinator = ProposalCoordinator()
    auditor = ChiefAuditor()
    financial = FinancialController()
    technical = TechnicalAdvisor()
    vote_counter = VoteCounter()

    # Create workflow graph
    workflow = StateGraph(AgentState)

    # 1. Precheck
    workflow.add_node("precheck", checker.precheck)
    # 2. analysis nodes
    workflow.add_node("coordinator", coordinator.analyze)
    workflow.add_node("financial", financial.analyze)
    workflow.add_node("technical", technical.analyze)
    workflow.add_node("auditor", auditor.analyze)
    # 3. voting nodes
    workflow.add_node("coordinator_vote", coordinator.vote)
    workflow.add_node("financial_vote", financial.vote)
    workflow.add_node("technical_vote", technical.vote)
    workflow.add_node("auditor_vote", auditor.vote)
    # 4. final decision
    workflow.add_node("decision", auditor.make_final_decision)
    # 5. vote counting
    workflow.add_node("count_votes", vote_counter.count_votes)

    # Set entry point
    workflow.set_entry_point("precheck")

    # If precheck passes → moves to coordinator
    # If precheck fails → ends workflow
    workflow.add_conditional_edges(
        "precheck",
        lambda x: (
            "coordinator"
            if x["validation_results"]
            .get("precheck", {})
            .get("proceed_to_review", False)
            else END
        ),
        ["coordinator", END],
    )

    # Discussion phase
    workflow.add_edge("coordinator", "financial")
    workflow.add_edge("financial", "technical")
    workflow.add_edge("technical", "auditor")

    # Add conditional edge from auditor to either continue discussion or start voting
    workflow.add_conditional_edges(
        "auditor",
        lambda x: (
            "coordinator_vote"
            if x["current_round"] > x["max_rounds"]
            else "coordinator"
        ),
        ["coordinator_vote", "coordinator"],
    )

    # Connect voting nodes in sequence
    workflow.add_edge("coordinator_vote", "financial_vote")
    workflow.add_edge("financial_vote", "technical_vote")
    workflow.add_edge("technical_vote", "auditor_vote")
    workflow.add_edge("auditor_vote", "count_votes")
    workflow.add_edge("count_votes", "decision")

    # Final decision to end
    workflow.add_edge("decision", END)

    return workflow.compile()


class AIAgentCommitee:

    def __init__(self, max_rounds: int = 3):
        self.max_rounds = max_rounds
        self.graph = create_aiac_graph()

    def save_graph_image(self):
        graph_image = Image(self.graph.get_graph().draw_mermaid_png())
        with open("workflow.png", "wb") as f:
            f.write(graph_image.data)
        print("Graph visualization saved!")

    def review_proposal(self, proposal: Proposal) -> Dict[str, Any]:
        initial_state = AgentState(
            proposal=proposal.to_dict(),
            current_round=1,
            discussion_history=[],
            votes={},
            next_agent="coordinator",
            validation_results={},
            max_rounds=self.max_rounds,
            final_decision=FinalDecision(
                decision="REJECT", justification="internal error"
            ),
            vote_counts={"approve": 0, "reject": 0},
        )

        last_state = None
        for state in self.graph.stream(initial_state):
            last_state = state

        return last_state


if __name__ == "__main__":
    committee = AIAgentCommitee()
    committee.save_graph_image()
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

    final_state = committee.review_proposal(test_proposal)
    print(f"\n\n{final_state}")
