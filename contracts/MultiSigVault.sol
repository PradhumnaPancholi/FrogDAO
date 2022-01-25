// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

contract MultisigVault {

  address[] private owners;
  uint8 private _votesRequired;

  mapping (address => bool) public isOwner;
  mapping(address => bool) private votes;

  event Recieved(address indexed sender, uint256 recieved);

  constructor(address[] memory _owners, uint8 _required) payable {
    for(uint i = 0; i < _owners.length; i++) {
      address owner = _owners[i];
      require(owner != address(0), "invalid owner");
      require(!isOwner[owner], "owner already exists");

      isOwner[owner] = true;
      owners.push(owner);
    }

    _votesRequired = _required;
  }

  receive() external payable {
    emit Recieved(msg.sender, msg.value);
  }


}