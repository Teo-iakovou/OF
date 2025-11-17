import { MaximalPaths } from "../utils/maximal-paths";
import BigNumber from 'bignumber.js';
import { Pair, Token, Types } from '..';
/**
 * Math calculations for Swap functions.
 */
export declare class Swap {
    /**
     * Default fee for swap (0.3%)
     */
    static readonly DEFAULT_FEE = 0.003;
    /**
     * Calculate the resultant amount of a swap.
     * @param {Swap.GetAmountOutParams} params
     * @returns {BigNumber}
     */
    static getAmountOut(params: Swap.GetAmountOutParams): BigNumber;
    /**
     * Calculate the needed amount to do a swap.
     * @param {Swap.GetAmountInParams} params
     * @returns {BigNumber}
     */
    static getAmountIn(params: Swap.GetAmountInParams): BigNumber;
    /**
     * Calculate minimal amount of a swap.
     * @param {Swap.GetAmountMinParams} params
     * @returns {BigNumber}
     */
    static getAmountMin: (params: Swap.GetAmountMinParams) => BigNumber;
    /**
     * Calculate the price impact based on given amounts and prices.
     * @param {Swap.GetPriceImpactParams} params
     * @returns {BigNumber}
     */
    static getPriceImpact(params: Swap.GetPriceImpactParams): BigNumber;
    /**
     * Calculate the best token path to realize the swap and the output amount.
     * @param {Swap.GetTokenPathsParams} params
     * @returns {MaximalPaths.PathList}
     */
    static getTokenPaths({ pairList, tokenList, tokenId, amount, dataKey, }: Swap.GetTokenPathsParams): MaximalPaths.PathList;
}
/**
 * Type definition for the Swap.
 */
export declare namespace Swap {
    /**
     * Defines if function should be for "token from" or "token to".
     */
    type DataKey = 'from' | 'to';
    /**
     * Type definition for getAmountOut function params.
     * @param {Types.Amount} amountIn Amount of token in to swap
     * @param {Types.Decimals} decimalsIn Decimals of token in
     * @param {Types.Decimals} decimalsOut Decimals of token out
     * @param {Types.Number} reserveIn Amount of token in on swap canister reserve
     * @param {Types.Number} reserveOut Amount of token out on swap canister reserve
     * @param {Types.Number} fee Amount of token out on swap canister reserve
     * @param {Types.Number} dataKey Calculate amount for "token from" or "token to"
     */
    interface GetAmountOutParams {
        amountIn: Types.Amount;
        decimalsIn: Types.Decimals;
        decimalsOut: Types.Decimals;
        reserveIn: Types.Number;
        reserveOut: Types.Number;
        fee?: Types.Number;
    }
    /**
     * Type definition for getAmountIn function params.
     * @param {Types.Amount} amountOut Amount of token out of swap
     * @param {Types.Decimals} decimalsIn Decimals of token in
     * @param {Types.Decimals} decimalsOut Decimals of token out
     * @param {Types.Number} reserveIn Amount of token in on swap canister reserve
     * @param {Types.Number} reserveOut Amount of token out on swap canister reserve
     * @param {Types.Number} fee Amount of token out on swap canister reserve
     * @param {Types.Number} dataKey Calculate amount for "token from" or "token to"
     */
    interface GetAmountInParams {
        amountOut: Types.Amount;
        decimalsIn: Types.Decimals;
        decimalsOut: Types.Decimals;
        reserveIn: Types.Number;
        reserveOut: Types.Number;
        fee?: Types.Number;
    }
    /**
     * Type definition for getAmountMin function params.
     * @param {Types.Amount} amount Amount of token in to swap
     * @param {Types.Decimals} decimals Decimals of token in
     * @param {Types.Number} slippage Allowed slippage percentage
     */
    interface GetAmountMinParams {
        amount: Types.Amount;
        slippage: Types.Number;
        decimals: Types.Decimals;
    }
    /**
     * Type definition for getPriceImpact function params.
     * @param {Types.Amount} amountIn Amount of token in of swap
     * @param {Types.Amount} amountOut Amount of token out of swap
     * @param {Types.Amount} priceIn Price of single token in of swap
     * @param {Types.Amount} priceOut Price of single token out of swap
     */
    interface GetPriceImpactParams {
        amountIn: Types.Amount;
        amountOut: Types.Amount;
        priceIn: Types.Amount;
        priceOut: Types.Amount;
    }
    /**
     * Type definition for getTokenPaths function params.
     * @param {Pair.List} pairList List of pairs from swap canister
     * @param {Token.List} tokenList List of tokens from swap canister
     * @param {string} tokenId Token id
     * @param {Types.Amount} amount Amount of token in to swap
     * @param {DataKey} dataKey Calculate amount for "token from" or "token to"
     */
    type GetTokenPathsParams = {
        pairList: Pair.List;
        tokenList: Token.MetadataList;
        tokenId: string;
        amount?: Types.Amount;
        dataKey?: DataKey;
    };
}
