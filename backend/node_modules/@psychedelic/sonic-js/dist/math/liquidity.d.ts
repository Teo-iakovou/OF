import BigNumber from 'bignumber.js';
import { Pair } from "../declarations/pair";
import { Types } from '../';
/**
 * Math calculations for Liquidity functions.
 */
export declare class Liquidity {
    /**
     * Constant from Swap Canister.
     */
    static readonly MINIMUM_LIQUIDITY = 1000;
    static readonly PAIR_DECIMALS = 8;
    /**
     * Calculate the opposite token value for given pair in Liquidity Position.
     * @param {Liquidity.GetOppositeAmountParams} params
     * @returns {BigNumber}
     */
    static getOppositeAmount(params: Liquidity.GetOppositeAmountParams): BigNumber;
    /**
     * Calculate the minimal amount to be input for a given token of a pair.
     * @param {Liquidity.GetMinimalAmountInParams} params
     * @returns {BigNumber}
     */
    static getMinimalAmountIn(params: Liquidity.GetMinimalAmountInParams): BigNumber;
    /**
     * Calculate the Liquidity Position for given amounts of a pair of tokens that is going to be added.
     * @param {Liquidity.GetPositionParams} params
     * @returns {BigNumber}
     */
    static getPosition(params: Liquidity.GetPositionParams): BigNumber;
    /**
     * Calculate Share of a pool of the position based on total supply.
     * @param {Liquidity.GetShareOfPoolParams} params
     * @returns {BigNumber}
     */
    static getShareOfPool(params: Liquidity.GetShareOfPoolParams): BigNumber;
    /**
     * Calculate the amount of a token in a position based on total supply.
     * @param {Liquidity.GetUserPositionValueParams} params
     * @returns {BigNumber}
     **/
    static getUserPositionValue(params: Liquidity.GetUserPositionValueParams): BigNumber;
    /**
     * Calculate the token balances for given pair Liquidity Position.
     * @param {Liquidity.GetTokenBalancesParams} params
     * @returns {Liquidity.GetTokenBalancesResult}
     */
    static getTokenBalances(params: Liquidity.GetTokenBalancesParams): Liquidity.GetTokenBalancesResult;
}
/**
 * Type definition for the Liquidity.
 */
export declare namespace Liquidity {
    /**
     * Type definition for getOppositeAmount function params.
     * @param {Types.Amount} amountIn Amount of a token in a position
     * @param {Types.Number} reserveIn Amount of token in on swap canister reserve
     * @param {Types.Number} reserveOut Amount of token out on swap canister reserve
     * @param {Types.Decimals} decimalsIn Decimals of token in
     * @param {Types.Decimals} decimalsIn Decimals of token out
     */
    interface GetOppositeAmountParams {
        amountIn: Types.Amount;
        reserveIn: Types.Number;
        reserveOut: Types.Number;
        decimalsIn: Types.Decimals;
        decimalsOut: Types.Decimals;
    }
    /**
     * Type definition for getMinimalAmountIn function params.
     * @param {Types.Number} reserve Amount of selected token on swap canister reserve
     * @param {Types.Number} reserveOpposite Amount of opposite token on swap canister reserve
     * @param {Types.Decimals} decimals Decimals of selected token
     * @param {Types.Decimals} decimalsOpposite Decimals of opposite token
     */
    interface GetMinimalAmountInParams {
        reserve: Types.Number;
        reserveOpposite: Types.Number;
        decimals: Types.Decimals;
        decimalsOpposite: Types.Decimals;
    }
    /**
     * Type definition for getPosition function params.
     * @param {Types.Amount} amount0 Amount of token 0
     * @param {Types.Amount} amount1 Amount of token 1
     * @param {Types.Decimals} decimals0 Decimals of token 0
     * @param {Types.Decimals} decimals1 Decimals of token 1
     * @param {Types.Number} reserve0 Amount of token 0 in swap canister reserve
     * @param {Types.Number} reserve1 Amount of token 1 in swap canister reserve
     * @param {Types.Number} totalSupply Total supply of the pair
     */
    interface GetPositionParams {
        amount0: Types.Amount;
        amount1: Types.Amount;
        decimals0: Types.Decimals;
        decimals1: Types.Decimals;
        reserve0: Types.Number;
        reserve1: Types.Number;
        totalSupply: Types.Number;
        slippage?: Types.Number;
    }
    /**
     * Type definition for getShareOfPool function params.
     */
    type GetShareOfPoolParams = GetPositionParams;
    /**
     * Type definition for getUserPositionValue function params.
     * @param {Types.Amount} price0 Price of token 0
     * @param {Types.Amount} price1 Price of token 1
     * @param {Types.Decimals} decimals0 Decimals of token 0
     * @param {Types.Decimals} decimals1 Decimals of token 1
     * @param {Types.Number} reserve0 Amount of token 0 in swap canister reserve
     * @param {Types.Number} reserve1 Amount of token 1 in swap canister reserve
     * @param {Types.Amount} totalShares Total supply of the pair
     * @param {Types.Amount} userShare Liquidity Position of user
     */
    interface GetUserPositionValueParams {
        decimals0: Types.Decimals;
        decimals1: Types.Decimals;
        price0: Types.Amount;
        price1: Types.Amount;
        reserve0: Types.Number;
        reserve1: Types.Number;
        totalShares: Types.Amount;
        userShares: Types.Amount;
    }
    /**
     * Type definition for getTokenBalances function params.
     * @param {Types.Decimals} decimals0 Decimals of token 0
     * @param {Types.Decimals} decimals1 Decimals of token 1
     * @param {Types.Number} reserve0 Amount of token 0 in swap canister reserve
     * @param {Types.Number} reserve1 Amount of token 1 in swap canister reserve
     * @param {Types.Amount} totalSupply Total supply of the pair
     * @param {Types.Amount} lpBalance Liquidity Position of user
     */
    interface GetTokenBalancesParams {
        decimals0: Types.Decimals;
        decimals1: Types.Decimals;
        reserve0: Types.Number;
        reserve1: Types.Number;
        totalSupply: Types.Number;
        lpBalance: Pair.Balance;
    }
    /**
     * Type definition for getTokenBalances return.
     * @param {BigNumber} balance0 Amount of token 0
     * @param {BigNumber} balance1 Amount of token 1
     */
    interface GetTokenBalancesResult {
        balance0: BigNumber;
        balance1: BigNumber;
    }
}
