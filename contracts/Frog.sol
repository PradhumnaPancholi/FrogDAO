pragma solidity ^0.8.0;

import "@openzeppelin/contract/token/ERC20/ERC20.sol";

/// @title $FROG, an erc-20 token ///
/// @author Pradhumna Pancholi ///
contract Frog is ERC20{
    contructor(uint _initialSupply) ERC20('FROG', '$FROG') {
        _mint(msg.sender, _initialSupply);
    }
}
