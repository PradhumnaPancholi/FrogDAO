// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./IERC20.sol";

interface IMonkee is IERC20 {
    function mint(address _to, uint256 _amount) external;
}