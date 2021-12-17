// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract FrogDAO is
  Governor,
  GovernorVotes,
  GovernorVotesQuorumFraction,
  GovernorTimelockControl
{

  // from GovernorCountingSimple.sol
  enum VoteType {
    Against,
    For,
    Abstain
  }

  // This will store the total number of votes cast and track who voted.
  struct ProposalVote {
    uint256 againstVotes;
    uint256 forVotes;
    uint256 abstainVotes;
    mapping(address => bool) voted;
  }

  // this holds a proposalId and stores ProposalVote for each proposal.
  mapping(uint256 => ProposalVote) _proposalVotes;

  constructor(ERC20Votes _token, TimelockController _timelock)
    Governor("FrogDAO")
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
    GovernorTimelockControl(_timelock)
  {}

  function votingDelay() public pure override returns (uint256) {
    return 6575; // 1 day.
  }

  function votingPeriod() public pure override returns (uint256) {
    return 46027; // 1 week.
  }

  function proposalThreshold() public pure override returns (uint256) {
    return 0; // no threshold.
  }

  function quorum(uint256 _blockNumber)
    public
    view
    override(IGovernor, GovernorVotesQuorumFraction)
    returns (uint256)
  {
    return super.quorum(_blockNumber);
  }

  function getVotes(address _account, uint256 _blockNumber)
    public
    view
    override(IGovernor, GovernorVotes)
    returns (uint256)
  {
    return super.getVotes(_account, _blockNumber);
  }

  function state(uint256 _proposalId)
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (ProposalState)
  {
    return super.state(_proposalId);
  }

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) public override(Governor, IGovernor) returns (uint256) {
    return super.propose(targets, values, calldatas, description);
  }

  function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(
    address[] memory target,
    uint256[] memory value,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
    return super._cancel(target, value, calldatas, descriptionHash);
  }

  function _executor()
    internal
    view
    override(Governor, GovernorTimelockControl)
    returns (address)
  {
    return super._executor();
  }

  function supportsInterface(bytes4 _interfaceID)
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (bool)
  {
    return super.supportsInterface(_interfaceID);
  }

  // TODO: @pradhumna.eth we need to build or own implementation for these next few functions.   
  // Openzeppeling provides a simple implementation of a counting system in extensions.
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol
  function COUNTING_MODE()
    public
    pure
    virtual
    override
    returns (string memory)
  {
    return "support=bravo&quorum=for,abstain";
  }


  // TODO: @pradhumna.eth according to the source for Governor.sol. support is generic so we can make it whatever we want.
  // for now I'll continue to use the GovnernorCountingSimple.sol implementation. Which is the enum at the top of the contract: VoteType
  
  function _countVote(
    uint256 proposalId,
    address account,
    uint8 support,
    uint256 weight
  ) internal virtual override {
    ProposalVote storage proposalvote = _proposalVotes[proposalId];

    // if the account is already in the voted map, revert the function call.
    require(!proposalvote.voted[account], "address has voted.");

    // address has now voted.
    proposalvote.voted[account] = true;

    // update the vote count.
    if (support == uint8(VoteType.Against)) {
      proposalvote.againstVotes += weight;
    } else if (support == uint8(VoteType.For)) {
      proposalvote.forVotes += weight;
    } else if (support == uint8(VoteType.Abstain)) {
      proposalvote.abstainVotes += weight;
    } else {
      revert("Invalid vote type.");
    }
  }
  

  function _quorumReached(uint256 proposalId) internal view override returns (bool) {
    ProposalVote storage proposalvote = _proposalVotes[proposalId];
    // in this particular implementation, abstaining votes are counted as for votes.
    return quorum(proposalSnapshot(proposalId)) <= proposalvote.forVotes + proposalvote.abstainVotes;
  }

  function _voteSucceeded(uint256 proposalId) internal view override returns (bool) {
    ProposalVote storage proposalvote = _proposalVotes[proposalId];
    return proposalvote.forVotes > proposalvote.againstVotes;
  }

  function hasVoted(uint256 _proposalId, address _account)
    public
    view
    virtual
    override
    returns (bool)
  {
    return _proposalVotes[_proposalId].voted[_account];
  }
}
