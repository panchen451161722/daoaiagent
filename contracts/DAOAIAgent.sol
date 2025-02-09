// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 引入IERC20接口
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract DAOAIAgent {
    // Proposal status enum
    enum ProposalStatus {
        Pending,    // Pending review
        Approved,   // Approved
        Rejected,   // Rejected
        Funded,     // Funded
        Executed,   // Executed
        Completed   // Completed
    }

    // Proposal execution feedback struct
    struct ExecutionFeedback {
        string feedback;           // Feedback text
        address submitter;         // Feedback submitter
        bool reviewed;             // Whether feedback has been reviewed
    }

    // Proposal struct
    struct Proposal {
        uint256 id;                 // Proposal ID
        ProposalStatus status;      // Proposal status
        bytes32 detailsHash;        // Hash of proposal details
        ExecutionFeedback executionFeedback; // Execution feedback
        address payable recipient;  // Address to receive funds
        uint256 amount;             // Amount to be funded
    }

    // AIA struct
    struct AIA {
        address aiaAddress;         // AIA address
        uint256 weight;             // Voting weight
        bool isActive;              // Is active
    }

    // State variables
    address public daoAdmin;        // DAO admin address
    uint256 public proposalCount;   // Total proposal count
    mapping(uint256 => Proposal) public proposals; // Proposal ID to Proposal mapping
    mapping(address => AIA) public aiAgents;       // AIA address to AIA mapping
    address[] public activeAIAgents;               // Active AIA list

    // New state variables
    IERC20 public tokenContract;                   // Token contract instance
    bool public allowIndependentAIA;               // Allow independent AIA
    bytes32 public otherContentHash;               // Other content hash

    // Events
    event ProposalCreated(uint256 indexed proposalId, bytes32 detailsHash);
    event ProposalStatusUpdated(uint256 indexed proposalId, ProposalStatus status);
    event ExecutionFeedbackSubmitted(uint256 indexed proposalId, string feedback, address indexed submitter);
    event ExecutionFeedbackReviewed(uint256 indexed proposalId, string feedback, address indexed reviewer);
    event FundsTransferred(uint256 indexed proposalId, address recipient, uint256 amount);

    // Modifier: Only DAO admin can call
    modifier onlyAdmin() {
        require(msg.sender == daoAdmin, "Only DAO admin can call this");
        _;
    }

    // Modifier: Only active AIA can call
    modifier onlyActiveAIA() {
        require(aiAgents[msg.sender].isActive, "Only active AIA can call this");
        _;
    }

    // Constructor
    constructor(address _tokenContractAddress, bool _allowIndependentAIA, bytes32 _otherContentHash) {
        daoAdmin = msg.sender;
        tokenContract = IERC20(_tokenContractAddress);
        allowIndependentAIA = _allowIndependentAIA;
        otherContentHash = _otherContentHash;
    }

    // Fallback function to accept Ether
    receive() external payable {}

    fallback() external payable {}

    // Create proposal
    function createProposal(bytes32 _detailsHash, address payable _recipient, uint256 _amount) external {
        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.status = ProposalStatus.Pending;
        proposal.detailsHash = _detailsHash;
        proposal.recipient = _recipient;
        proposal.amount = _amount;

        emit ProposalCreated(proposalCount, _detailsHash);
    }

    // AIAC review proposal (only active AIA)
    function reviewProposal(uint256 _proposalId, bool _approve) external onlyActiveAIA {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal is not pending");

        if (_approve) {
            proposal.status = ProposalStatus.Approved;
        } else {
            proposal.status = ProposalStatus.Rejected;
        }

        emit ProposalStatusUpdated(_proposalId, proposal.status);
    }

    // Fund proposal (only admin)
    function fundProposal(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Approved, "Proposal is not approved");
        require(tokenContract.balanceOf(address(this)) >= proposal.amount, "Insufficient token balance");
        
        proposal.status = ProposalStatus.Funded;
        emit ProposalStatusUpdated(_proposalId, ProposalStatus.Funded);

        // Transfer ERC20 tokens to the recipient
        require(tokenContract.transfer(proposal.recipient, proposal.amount), "Token transfer failed");
        emit FundsTransferred(_proposalId, proposal.recipient, proposal.amount);
    }

    // Mark proposal as executed (only admin)
    function markProposalExecuted(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Funded, "Proposal is not funded");
        proposal.status = ProposalStatus.Executed;
        emit ProposalStatusUpdated(_proposalId, ProposalStatus.Executed);
    }

    // Submit execution feedback
    function submitExecutionFeedback(uint256 _proposalId, string calldata _feedback) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Executed, "Proposal is not executed");
        proposal.executionFeedback = ExecutionFeedback({
            feedback: _feedback,
            submitter: msg.sender,
            reviewed: false
        });
        emit ExecutionFeedbackSubmitted(_proposalId, _feedback, msg.sender);
    }

    // Review execution feedback (only active AIA)
    function reviewExecutionFeedback(uint256 _proposalId) external onlyActiveAIA {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executionFeedback.reviewed, "Feedback already reviewed");
        proposal.executionFeedback.reviewed = true;
        emit ExecutionFeedbackReviewed(_proposalId, proposal.executionFeedback.feedback, msg.sender);
    }

    // Add or update AIA
    function addOrUpdateAIA(address _aiaAddress, uint256 _weight, bool _isActive) external onlyAdmin {
        if (aiAgents[_aiaAddress].aiaAddress == address(0)) {
            activeAIAgents.push(_aiaAddress);
        }
        aiAgents[_aiaAddress] = AIA({
            aiaAddress: _aiaAddress,
            weight: _weight,
            isActive: _isActive
        });
    }
}

