import json
import operator
import os
from dataclasses import dataclass
from enum import Enum
from typing import Annotated, Any, Dict, List, Literal, Sequence, TypedDict

from dotenv import load_dotenv
from IPython.display import Image
from langchain_core.messages import AIMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
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
            "additional_context": self.additional_context
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


# Agent Definitions
class BaseAgent:
    def __init__(self, role: str, weight: float, description: str):
        self.role = role
        self.weight = weight
        self.description = description
        self.llm = ChatOpenAI(
            model=os.getenv("MODEL"),
            temperature=0.7,
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
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"You are the {self.role} in the AI Agent Committee."),
            ("human", """Based on all discussions and your role's perspective, cast your vote on the proposal.

Full discussion history:
{discussion_history}

Proposal:
{proposal}

Cast your vote as one of: APPROVE, REJECT, or ABSTAIN. Provide a brief explanation in JSON format:
{{
    "vote": "APPROVE/REJECT/ABSTAIN",
    "explanation": "your explanation here"
}}""")
        ])

        messages = prompt.format_messages(
            discussion_history="\n".join(state["discussion_history"]),
            proposal=json.dumps(state["proposal"], indent=2)
        )

        response = self.llm.invoke(messages)
        try:
            result = json.loads(response.content)
            state["votes"][self.role] = result["vote"]
        except:
            state["votes"][self.role] = VoteDecision.ABSTAIN.value

        return state

class ProposalCoordinator(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Proposal Coordinator",
            weight=0.15,
            description="Responsible for proposal routing, prioritization, and ensuring proper format and completeness."
        )

class ChiefAuditor(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Chief Auditor",
            weight=0.20,
            description="Final approval/veto authority, responsible for overall compliance and risk assessment."
        )

    def make_final_decision(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are the Chief Auditor with final veto power."),
                (
                    "human",
                    """Review all discussions and votes to make the final decision.

Full discussion history:
{discussion_history}

Votes from committee members:
{votes}

Proposal:
{proposal}
""",
                ),
            ]
        )

        messages = prompt.format_messages(
            discussion_history="\n".join(state["discussion_history"]),
            votes=json.dumps(state["votes"], indent=2),
            proposal=json.dumps(state["proposal"], indent=2)
        )

        response = self.llm.with_structured_output(FinalDecision).invoke(messages)
        state["final_decision"] = response

        return state

class FinancialController(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Financial Controller",
            weight=0.12,
            description="Responsible for budget enforcement and financial risk assessment."
        )

class TechnicalAdvisor(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Technical Advisor",
            weight=0.08,
            description="Responsible for technical risk assessment and implementation feasibility."
        )

class ProposalChecker(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Proposal Checker",
            weight=0.0,  # No voting weight as this is a validation agent
            description="Responsible for initial proposal validation and quick risk assessment."
        )

    def precheck(self, state: AgentState) -> AgentState:
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Proposal Checker. Do a quick validation of the proposal."),
            ("human", """Do a quick check of the following proposal:
{proposal}

Check for:
1. Basic format and completeness
2. Quick feasibility assessment
3. Major red flags or risks

Respond in JSON format:
{{
    "status": "PASS/FAIL",
    "risk_level": "LOW/MEDIUM/HIGH",
    "issues": ["list of major issues if any"],
    "proceed_to_review": true/false,
    "explanation": "brief explanation of decision"
}}""")
        ])

        messages = prompt.format_messages(
            proposal=json.dumps(state["proposal"], indent=2)
        )

        response = self.llm.invoke(messages)
        try:
            result = json.loads(response.content)
            state["validation_results"]["precheck"] = result
            state["next_agent"] = "coordinator" if result.get("proceed_to_review", False) else END
        except:
            state["validation_results"]["precheck"] = {
                "status": "FAIL",
                "risk_level": "HIGH",
                "issues": ["Failed to validate proposal"],
                "proceed_to_review": False,
                "explanation": "System error in validation"
            }
            state["next_agent"] = END
        return state


def create_aiac_graph(max_rounds: int = 3):
    # Initialize agents
    checker = ProposalChecker()
    coordinator = ProposalCoordinator()
    auditor = ChiefAuditor()
    financial = FinancialController()
    technical = TechnicalAdvisor()

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
        ["coordinator", END]
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
            if x["current_round"] >= x["max_rounds"]
            else "coordinator"
        ),
        ["coordinator_vote", "coordinator"]
    )

    # Connect voting nodes in sequence
    workflow.add_edge("coordinator_vote", "financial_vote")
    workflow.add_edge("financial_vote", "technical_vote")
    workflow.add_edge("technical_vote", "auditor_vote")
    workflow.add_edge("auditor_vote", "decision")

    # Final decision to end
    workflow.add_edge("decision", END)

    return workflow.compile()


class AIAgentCommitee:

    def __init__(self, max_rounds: int = 3):
        self.max_rounds = max_rounds
        self.graph = create_aiac_graph(max_rounds)

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
        )

        last_state = None
        for output in self.graph.stream(initial_state):
            # The output contains the state directly
            state = output
            last_state = state

            # Get the current step from next_agent
            current_step = state.get("next_agent", "")

            # Handle different steps
            if current_step == "precheck":
                print("\nProposal Pre-check Results:")
                print(json.dumps(state["validation_results"].get("precheck", {}), indent=2))
                if state["next_agent"] == END:
                    print("\nProposal rejected during initial validation.")
                    return {"decision": "REJECTED", "justification": "Failed initial validation"}
            elif current_step in ["coordinator", "financial", "technical", "auditor"]:
                print(f"\nRound {state['current_round']} - {current_step.title()} Analysis:")
                if state["discussion_history"]:
                    print(state["discussion_history"][-1])
            elif "vote" in current_step:
                agent_name = current_step.split("_")[0].title()
                print(f"\n{agent_name} Vote: {state['votes'].get(agent_name, 'ABSTAIN')}")
            elif current_step == "final_decision":
                print("\nFinal Decision:")
                print(json.dumps(state.get("final_decision", {}), indent=2))

        return last_state.get("final_decision", {"decision": "REJECTED", "justification": "Process terminated early"})


if __name__ == "__main__":
    committee = AIAgentCommitee()
    committee.save_graph_image()
    test_proposal = Proposal(
        title="Pilot Implementation of Basic LLM Usage Analytics Dashboard",
        description="Develop a minimal viable product (MVP) dashboard to track essential LLM usage metrics and costs, serving as a foundation for future monitoring capabilities.",
        amount=45000.00,
        additional_context={
            "timeline": "2 months",
            "team_size": 1,
            "expected_outcomes": [
                "Basic dashboard showing daily/weekly LLM API usage patterns",
                "Simple cost tracking and reporting functionality",
                "Basic error rate monitoring",
                "Usage patterns by endpoint/application",
            ],
            "risk_mitigation": {
                "technical": "Using established open-source monitoring libraries and cloud-native solutions",
                "financial": "Fixed-price engagement with clear deliverables",
                "compliance": "Built-in data retention policies and access controls",
            },
            "success_metrics": {
                "performance": "Dashboard refresh rate under 5 minutes",
                "reliability": "99% dashboard uptime",
                "cost_efficiency": "Implementation cost recovered through 10% API cost reduction in first 6 months",
                "adoption": "Dashboard actively used by at least 3 teams",
            },
            "phased_implementation": [
                "Week 1-2: Requirements gathering and design",
                "Week 3-4: Core dashboard development",
                "Week 5-6: Testing and team training",
                "Week 7-8: Deployment and documentation",
            ],
        },
    )

    final_decision = committee.review_proposal(test_proposal)
    print(f"\n\n{final_decision}")
