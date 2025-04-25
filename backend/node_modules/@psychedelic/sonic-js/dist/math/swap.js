"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swap = void 0;
const maximal_paths_1 = require("../utils/maximal-paths");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const _1 = require(".");
const __1 = require("..");
/**
 * Math calculations for Swap functions.
 */
class Swap {
    /**
     * Calculate the resultant amount of a swap.
     * @param {Swap.GetAmountOutParams} params
     * @returns {BigNumber}
     */
    static getAmountOut(params) {
        const amountIn = (0, __1.toBigNumber)(params.amountIn).removeDecimals(params.decimalsIn);
        if (amountIn.isZero())
            return (0, __1.toBigNumber)(0);
        const reserveIn = (0, __1.toBigNumber)(params.reserveIn);
        const reserveOut = (0, __1.toBigNumber)(params.reserveOut);
        const fee = (0, __1.toBigNumber)(params.fee || this.DEFAULT_FEE);
        if (amountIn.isZero())
            return (0, __1.toBigNumber)(0);
        const feeCoefficient = (0, __1.toBigNumber)(1).minus(fee);
        const amountInWithFee = amountIn.multipliedBy(feeCoefficient);
        const numerator = amountInWithFee.multipliedBy(reserveOut);
        const denominator = reserveIn.plus(amountInWithFee);
        return numerator.dividedBy(denominator).applyDecimals(params.decimalsOut);
    }
    /**
     * Calculate the needed amount to do a swap.
     * @param {Swap.GetAmountInParams} params
     * @returns {BigNumber}
     */
    static getAmountIn(params) {
        const amountOut = (0, __1.toBigNumber)(params.amountOut).removeDecimals(params.decimalsOut);
        if (amountOut.isZero())
            return (0, __1.toBigNumber)(0);
        const reserveIn = (0, __1.toBigNumber)(params.reserveIn);
        const reserveOut = (0, __1.toBigNumber)(params.reserveOut);
        const feeCoefficient = (0, __1.toBigNumber)(params.fee || this.DEFAULT_FEE).plus(1);
        const numerator = amountOut.multipliedBy(reserveIn);
        const denominator = reserveOut.minus(amountOut);
        const amountIn = numerator
            .dividedBy(denominator)
            .multipliedBy(feeCoefficient)
            .applyDecimals(params.decimalsIn);
        return amountIn;
    }
    /**
     * Calculate the price impact based on given amounts and prices.
     * @param {Swap.GetPriceImpactParams} params
     * @returns {BigNumber}
     */
    static getPriceImpact(params) {
        const amountIn = (0, __1.toBigNumber)(params.amountIn);
        const amountOut = (0, __1.toBigNumber)(params.amountOut);
        const priceIn = (0, __1.toBigNumber)(params.priceIn);
        const priceOut = (0, __1.toBigNumber)(params.priceOut);
        const object = { amountIn, amountOut, priceIn, priceOut };
        if ((0, __1.checkIfObject)(object, { isNotANumber: true, isZero: true })) {
            return (0, __1.toBigNumber)(0);
        }
        if ((0, __1.checkIfObject)(object, { isNegative: true })) {
            throw new Error('Negative amountIn, amountOut, priceIn or priceOut are not allowed');
        }
        const _amountOut = _1.Price.getByAmount({
            amount: amountOut.toString(),
            price: priceOut,
        });
        const _amountIn = _1.Price.getByAmount({
            amount: amountIn.toString(),
            price: priceIn,
        });
        const priceImpact = new bignumber_js_1.default(1)
            .minus(new bignumber_js_1.default(_amountOut).dividedBy(_amountIn))
            .multipliedBy(100)
            .negated();
        return priceImpact;
    }
    /**
     * Calculate the best token path to realize the swap and the output amount.
     * @param {Swap.GetTokenPathsParams} params
     * @returns {MaximalPaths.PathList}
     */
    static getTokenPaths({ pairList, tokenList, tokenId, amount = '1', dataKey = 'from', }) {
        if (!pairList[tokenId])
            return {};
        const filledPairs = (0, __1.removeEmptyPairs)(pairList);
        const graphResolver = dataKey === 'from' ? maximal_paths_1.findMaximalPaths : maximal_paths_1.findReverseMaximalPaths;
        const graphNodes = graphResolver(filledPairs, tokenList, tokenId, (0, __1.toBigNumber)(amount));
        return Object.values(graphNodes).reduce((acc, node) => {
            if (node.path.size < 2)
                return acc;
            return {
                ...acc,
                [node.id]: {
                    path: Array.from(node.path),
                    amountOut: node.amountOut,
                },
            };
        }, {});
    }
}
exports.Swap = Swap;
/**
 * Default fee for swap (0.3%)
 */
Swap.DEFAULT_FEE = 0.003;
/**
 * Calculate minimal amount of a swap.
 * @param {Swap.GetAmountMinParams} params
 * @returns {BigNumber}
 */
Swap.getAmountMin = (params) => {
    const amount = (0, __1.toBigNumber)(params.amount);
    const slippage = (0, __1.toBigNumber)(params.slippage);
    const decimals = (0, __1.toBigNumber)(params.decimals);
    const object = { amount, slippage, decimals };
    if ((0, __1.checkIfObject)(object, { isNotANumber: true, isZero: true })) {
        return (0, __1.toBigNumber)(0);
    }
    if ((0, __1.checkIfObject)(object, { isNegative: true })) {
        throw new Error('Negative amount, slippage or decimals are not allowed');
    }
    return amount
        .applyTolerance(slippage.dividedBy(100).toNumber())
        .dp(decimals.toNumber());
};
//# sourceMappingURL=swap.js.map