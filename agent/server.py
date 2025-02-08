from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from main import AIAgentCommitee, Proposal
from pydantic import BaseModel

app = FastAPI()


class ProposalRequest(BaseModel):
    title: str
    description: str
    amount: float
    additional_context: Optional[Dict[str, Any]] = None


@app.post("/invoke")
async def invoke_committee(proposal_req: ProposalRequest):
    try:
        # Convert request to Proposal object
        proposal = Proposal(
            title=proposal_req.title,
            description=proposal_req.description,
            amount=proposal_req.amount,
            additional_context=proposal_req.additional_context,
        )

        # Create committee and review proposal
        committee = AIAgentCommitee()
        final_state = committee.review_proposal(proposal)

        return final_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
