// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./token/ERC20.sol";
import "./token/extensions/draft-ERC20Permit.sol";
import "./token/extensions/ERC20Votes.sol";
import "./utils/math/SafeMath.sol";

/// @title $FROG, an erc-20 token ///
/// @author Pradhumna Pancholi, Zach Berwaldt ///
contract FrogERC20Token is ERC20, ERC20Permit, ERC20Votes {

  // @pradhumna. I added Safemath to shut up the compiler.
  using SafeMath for uint256;

  constructor() ERC20("Frog", "FROG") ERC20Permit("Frog") {}

  function mint(address _account, uint256 _amount) external {
    _mint(_account, _amount);
  }

  function burn(uint256 _amount) public virtual {
    _burn(msg.sender, _amount);
  }

  // TODO: Why two?
  function burnFrom(address _account, uint256 _amount) public virtual {
    _burnFrom(_account, _amount);
  }

  // TODO: Is this a duplicate?
  function _burnFrom(address _account, uint256 _amount) public virtual {
    // come back to this. allowance is from the ERC20 contract.
    // it's a map address -> map address -> uint256.
    uint256 decreasedAllowance = allowance(_account, msg.sender).sub(_amount, "ERC20: burn amount exceeds allowance");

    _approve(_account, msg.sender, decreasedAllowance);
    _burn(_account, _amount);
  }

  function _mint(address _account, uint256 _amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._mint(_account, _amount);
  }

  function _burn(address _account, uint256 _amount)
    internal
    override(ERC20, ERC20Votes)
  {
    super._burn(_account, _amount);
  }

  function _afterTokenTransfer(
    address _from,
    address _to,
    uint256 _amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(_from, _to, _amount);
  }
}


/// @pradhumna.eth: If we're going to create multiple tokens, wouldn't ERC1155 be better?