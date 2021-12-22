pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract FrogTimelockController is TimelockController {
  constructor(uint256 _minDelay, address[] memory _proposers, address[] memory _executors) TimelockController(_minDelay, _proposers, _executors) {}
}