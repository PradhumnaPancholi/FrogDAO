// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;


import "./access/AccessControl.sol";
import "./utils/math/SafeMath.sol";
import "./token/SafeERC20.sol";
import "./interfaces/IMonkee.sol";
import "./interfaces/IERC20.sol";

import "./Frog.sol";

contract Staking is AccessControl {

  using SafeMath for uint256;
  using SafeERC20 for IERC20;
  using SafeERC20 for FrogERC20Token;
  using SafeERC20 for IMonkee;

  /**
   * Events 
   */
  event Staked(address indexed staker, uint256 amount);

  /**
   * State Variables.
   */

  bytes32 public constant MEMBER = keccak256("MEMBER_ROLE");

  IERC20 public immutable FROG;
  IERC20 public immutable MONKEE;

  constructor(
    address _minter,
    address _frog,
    address _monkee
  ) AccessControl() {
    require(_minter != address(0), "Zero address: Minter");
    _setupRole(MEMBER, _minter);
    require(_frog != address(0), "Zero address: Frog");
    FROG = IERC20(_frog);
    require(_monkee != address(0), "Zero address: Monkee");
    MONKEE = IERC20(_monkee);
  }

  /**
   * Methods
   */
  function stake (
    address _to,
    uint256 _amount
  ) external returns (uint256) {
    // transfer Frog to the staking contract
    FROG.safeTransferFrom(msg.sender, address(this), _amount);
    // return the results of the internal _send method.
    return _send(_to, _amount);
  }


  function _send(
    address _to,
    uint256 _amount
  ) internal returns (uint256) {
    // check if the sender has enough Frog to stake
    MONKEE.mint(_to, _amount);
    // emit the staked event
    return _amount;
  }
}