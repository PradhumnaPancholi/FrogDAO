// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";


contract FrogDAO is Governor, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes _token, TimelockController _timelock) Governor("FrogDAO") GovernorVotes(_token) GovernorVotesQuorumFraction(4) GovernorTimelockControl(_timelock) {}

    function votingDelay() public pure override returns (uint) {
        return 6575; // 1 day.
    }

    function votingPeriod() public pure override returns (uint) {
        return 46027; // 1 week.
    }

    function proposalThreshold() public pure override returns (uint) {
        return 0; // no threshold.
    }

    function quorum(uint256 _blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(_blockNumber);
    }

    function getVotes(address _account, uint256 _blockNumber) public view override(IGovernor, GovernorVotes) returns (uint256) {
        return super.getVotes(_account, _blockNumber);
    }

    function state(uint256 _proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(_proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory target, uint256[] memory value, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        super._cancel(target, value, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 _interfaceID) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(_interfaceID);
    }

    // function COUNTING_MODE() public pure virtual returns (string memory) {
        
    // }

    // function _countVote(
    //     uint256 proposalId,
    //     address account,
    //     uint8 support,
    //     uint256 weight
    // ) internal virtual {
    //     return super._countVote(proposalId, account, support, weight);
    // }

    // function _quorumReached(uint256 proposalId) interal view virtual returns (bool) {

    // }

    // function _voteSucceeded(uint256 proposalId) internal view virtual returns (bool) {

    // }

    // function hasVoted(uint256 proposalId, address _account) public view virtual returns (bool) {

    // }
}