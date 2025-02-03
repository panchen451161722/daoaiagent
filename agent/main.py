from typing import List, Dict, Any, Annotated, TypedDict, Sequence
from dataclasses import dataclass
from enum import Enum
import operator
import json
from typing_extensions import TypedDict

from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolExecutor
import os
from dotenv import load_dotenv

load_dotenv()

# Data Models
class VoteDecision(str, Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    ABSTAIN = "ABSTAIN"

class ValidationResult(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"

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
    messages: Annotated[Sequence[BaseMessage], operator.add]
    proposal: Dict[str, Any]
    current_round: int
    discussion_history: List[str]
    votes: Dict[str, str]
    next_agent: str
    validation_results: Dict[str, Dict[str, Any]]

# Agent Definitions
class BaseAgent:
    def __init__(self, role: str, weight: float, description: str):
        self.role = role
        self.weight = weight
        self.description = description
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            base_url=os.getenv("BASE_URL"),
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def get_prompt(self, round_num: int) -> ChatPromptTemplate:
        return ChatPromptTemplate.from_messages([
            ("system", f"""You are a {self.role} in the AI Agent Committee with the following responsibilities:
{self.description}

Current discussion round: {round_num}/3"""),
            MessagesPlaceholder(variable_name="messages"),
            ("human", """Please analyze the following proposal from your role's perspective:
{proposal}

Previous discussions:
{discussion_history}

Provide your analysis and concerns based on your role. Be specific and professional.""")
        ])

    def analyze(self, state: AgentState) -> AgentState:
        prompt = self.get_prompt(state["current_round"])
        messages = prompt.format_messages(
            messages=state["messages"],
            proposal=json.dumps(state["proposal"], indent=2),
            discussion_history="\n".join(state["discussion_history"])
        )
        response = self.llm.invoke(messages)
        state["discussion_history"].append(f"Round {state['current_round']} - {self.role}: {response.content}")
        state["messages"].append(AIMessage(content=response.content))
        
        # Determine next agent
        agents = ["coordinator", "financial", "technical", "auditor"]
        current_idx = agents.index(state["next_agent"])
        next_idx = (current_idx + 1) % len(agents)
        state["next_agent"] = agents[next_idx]
        
        if state["next_agent"] == "coordinator" and state["current_round"] < 3:
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
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Chief Auditor with final veto power."),
            ("human", """Review all discussions and votes to make the final decision.

Full discussion history:
{discussion_history}

Votes from committee members:
{votes}

Proposal:
{proposal}

Make your final decision in JSON format:
{{
    "decision": "APPROVED/REJECTED",
    "justification": "your detailed justification"
}}""")
        ])
        
        messages = prompt.format_messages(
            discussion_history="\n".join(state["discussion_history"]),
            votes=json.dumps(state["votes"], indent=2),
            proposal=json.dumps(state["proposal"], indent=2)
        )
        
        response = self.llm.invoke(messages)
        try:
            result = json.loads(response.content)
            state["final_decision"] = result
        except:
            state["final_decision"] = {"decision": "REJECTED", "justification": "Error in decision process"}
            
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

def create_aiac_graph():
    # Initialize agents
    checker = ProposalChecker()
    coordinator = ProposalCoordinator()
    auditor = ChiefAuditor()
    financial = FinancialController()
    technical = TechnicalAdvisor()
    
    # Create workflow graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("precheck", checker.precheck)
    workflow.add_node("coordinator", coordinator.analyze)
    workflow.add_node("financial", financial.analyze)
    workflow.add_node("technical", technical.analyze)
    workflow.add_node("auditor", auditor.analyze)
    workflow.add_node("coordinator_vote", coordinator.vote)
    workflow.add_node("financial_vote", financial.vote)
    workflow.add_node("technical_vote", technical.vote)
    workflow.add_node("auditor_vote", auditor.vote)
    workflow.add_node("final_decision", auditor.make_final_decision)
    
    # Set entry point
    workflow.set_entry_point("precheck")
    
    # Define routing function
    def get_next_step(state: AgentState) -> str:
        if state["next_agent"] == END:
            return END
        
        # After precheck, go to coordinator if passed
        if state.get("validation_results", {}).get("precheck", {}).get("proceed_to_review", False):
            state["next_agent"] = "coordinator"
            return "coordinator"
        
        # During discussion rounds
        if state["current_round"] <= 3:
            return state["next_agent"]
        
        # After discussions, go to voting
        if state["next_agent"] in ["coordinator", "financial", "technical", "auditor"]:
            return f"{state['next_agent']}_vote"
        
        # During voting phase
        if "_vote" in state["next_agent"]:
            current = state["next_agent"].split("_")[0]
            if current == "coordinator":
                return "financial_vote"
            elif current == "financial":
                return "technical_vote"
            elif current == "technical":
                return "auditor_vote"
            elif current == "auditor":
                return "final_decision"
        
        # After final decision
        if state["next_agent"] == "final_decision":
            return END
        
        return END
    
    # Add edges
    workflow.add_edge("precheck", get_next_step)
    workflow.add_edge("coordinator", get_next_step)
    workflow.add_edge("financial", get_next_step)
    workflow.add_edge("technical", get_next_step)
    workflow.add_edge("auditor", get_next_step)
    workflow.add_edge("coordinator_vote", get_next_step)
    workflow.add_edge("financial_vote", get_next_step)
    workflow.add_edge("technical_vote", get_next_step)
    workflow.add_edge("auditor_vote", get_next_step)
    workflow.add_edge("final_decision", END)
    
    return workflow.compile()

class AIACCommittee:
    def __init__(self):
        self.graph = create_aiac_graph()
    
    def review_proposal(self, proposal: Proposal) -> Dict[str, Any]:
        initial_state = AgentState(
            messages=[],
            proposal=proposal.to_dict(),
            current_round=1,
            discussion_history=[],
            votes={},
            next_agent="coordinator",
            validation_results={}
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
    committee = AIACCommittee()
    test_proposal = Proposal(
        title="AI Research Funding Proposal",
        description="Expand AI research capabilities through implementation of advanced neural architectures and quantum computing integration.",
        amount=500000.00,
        additional_context={
            "timeline": "12 months",
            "team_size": 5,
            "expected_outcomes": "Improved model performance by 40%"
        }
    )
    
    final_decision = committee.review_proposal(test_proposal)