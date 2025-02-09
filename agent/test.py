import os
import sys
from pathlib import Path

# Add the parent directory to sys.path to allow importing agent module
current_dir = Path(__file__).parent
parent_dir = str(current_dir.parent)
sys.path.append(parent_dir)

from agent.main import ContractAgent


def main():
    agent = ContractAgent()
    result = agent.review_proposal(agent.wallet, 2, True)
    print(f"Review result: {result}")


if __name__ == "__main__":
    main()
