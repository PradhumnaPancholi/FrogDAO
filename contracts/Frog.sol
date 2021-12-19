// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title $FROG, an erc-20 token ///
/// @author Pradhumna Pancholi, Zach Berwaldt ///
contract FrogERC20Token is ERC20, ERC20Permit, ERC20Votes {
  constructor() ERC20("Frog", "FROG") ERC20Permit("Frog") {}

  function mint(address _account, uint256 _amount) external {
    _mint(_account, _amount);
  }

  function burn(uint256 _amount) public virtual {
    _burn(msg.sender, _amount);
  }

  function burnFrom(address _account, uint256 _amount) public virtual {
    _burnFrom(_account, _amount);
  }

  function _burnFrom(address _account, uint256 _amount) public virtual {
    // come back to this.
    uint256 decreasedAllowance = allowance(_account, msg.sender);

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
