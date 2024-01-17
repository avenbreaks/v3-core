// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/ILyzoV3PoolImmutables.sol';
import './pool/ILyzoV3PoolState.sol';
import './pool/ILyzoV3PoolDerivedState.sol';
import './pool/ILyzoV3PoolActions.sol';
import './pool/ILyzoV3PoolOwnerActions.sol';
import './pool/ILyzoV3PoolEvents.sol';

/// @title The interface for a Uniswap V3 Pool
/// @notice A Uniswap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface ILyzoV3Pool is
    ILyzoV3PoolImmutables,
    ILyzoV3PoolState,
    ILyzoV3PoolDerivedState,
    ILyzoV3PoolActions,
    ILyzoV3PoolOwnerActions,
    ILyzoV3PoolEvents
{

}
