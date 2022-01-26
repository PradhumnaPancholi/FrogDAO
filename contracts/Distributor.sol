// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";
import "./utils/cryptography/MerkleProof.sol";

contract Distributor {
  IERC20 public immutable frog;
  bytes32 public immutable merkleRoot;

  mapping(address => bool) private claimed;

  event Claimed(address account, uint256 amount);
  
  constructor(address frogtoken_, bytes32 merkleRoot_) {
    require(frogtoken_ != address(0), "Frog: address 0");
    frog = IERC20(frogtoken_);
    merkleRoot = merkleRoot_;
  }

  function claim(address account_, uint256 amount_, bytes32[] calldata merkleProof_) external {
    require(!claimed[account_], "Distributor: already claimed.");

    // Verify the merkle proof.
    bytes32 node = keccak256(abi.encodePacked(account_, amount_));
    require(MerkleProof.verify(merkleProof_, merkleRoot, node), "Distributor: Invalid proof.");

    claimed[account_] = true;
    // Mark it claimed and send the token.
    require(frog.transfer(account_, amount_), "Distributor: Transfer failed.");

    emit Claimed(account_, amount_);
  }
}

// reference: https://github.com/steve-ng/merkle-airdrop