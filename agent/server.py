from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from main import AIAgentCommitee, DAOInfo, Proposal
from pydantic import BaseModel

app = FastAPI()


class ProposalRequest(BaseModel):
    proposal: Dict[str, Any]
    dao_info: Dict[str, Any]
    agents_config: List[Dict[str, Any]]


@app.post("/invoke")
async def invoke_committee(proposal_req: ProposalRequest):
    try:
        # Convert request to Proposal object
        proposal = Proposal(
            id=proposal_req.proposal["id"],
            title=proposal_req.proposal["title"],
            description=proposal_req.proposal["description"],
            amount=proposal_req.proposal["amount"],
            additional_context=proposal_req.proposal.get("additional_context"),
        )

        # Create DAO info object
        dao_info = DAOInfo(
            name=proposal_req.dao_info["name"],
            description=proposal_req.dao_info["description"],
            objective=proposal_req.dao_info["objective"],
            values=proposal_req.dao_info["values"],
        )

        # Create committee and review proposal
        committee = AIAgentCommitee(proposal_req.agents_config)
        final_state = committee.review_proposal(proposal, dao_info)

        return final_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
