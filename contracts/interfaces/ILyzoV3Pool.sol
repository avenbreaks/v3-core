// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/LyzoV3PoolImmutables.sol';
import './pool/LyzoV3PoolState.sol';
import './pool/LyzoV3PoolDerivedState.sol';
import './pool/LyzoV3PoolActions.sol';
import './pool/LyzoV3PoolOwnerActions.sol';
import './pool/LyzoV3PoolEvents.sol';

/// @title The interface for a Uniswap V3 Pool
/// @notice A Uniswap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface LyzoV3Pool is
    LyzoV3PoolImmutables,
    LyzoV3PoolState,
    LyzoV3PoolDerivedState,
    LyzoV3PoolActions,
    LyzoV3PoolOwnerActions,
    LyzoV3PoolEvents
{

}
