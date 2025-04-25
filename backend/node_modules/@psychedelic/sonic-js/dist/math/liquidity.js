"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liquidity = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("../utils");
const __1 = require("../");
/**
 * Math calculations for Liquidity functions.
 */
class Liquidity {
    /**
     * Calculate the opposite token value for given pair in Liquidity Position.
     * @param {Liquidity.GetOppositeAmountParams} params
     * @returns {BigNumber}
     */
    static getOppositeAmount(params) {
        const amountIn = (0, utils_1.toBigNumber)(params.amountIn);
        const reserveIn = (0, utils_1.toBigNumber)(params.reserveIn).applyDecimals(params.decimalsIn);
        const reserveOut = (0, utils_1.toBigNumber)(params.reserveOut).applyDecimals(params.decimalsOut);
        if ((0, __1.checkIfObject)({ amountIn, reserveIn, reserveOut }, { isNotANumber: true, isZero: true })) {
            return (0, utils_1.toBigNumber)(0);
        }
        const minimalAmountIn = this.getMinimalAmountIn({
            decimals: params.decimalsIn,
            decimalsOpposite: params.decimalsOut,
            reserve: params.reserveIn,
            reserveOpposite: params.reserveOut,
        });
        if (amountIn.lt(minimalAmountIn)) {
            throw new Error(`Minimal amountIn: ${minimalAmountIn.toString()}`);
        }
        const oppositeAmount = amountIn
            .multipliedBy(reserveOut)
            .dividedBy(reserveIn)
            .dp(params.decimalsOut);
        return oppositeAmount;
    }
    /**
     * Calculate the minimal amount to be input for a given token of a pair.
     * @param {Liquidity.GetMinimalAmountInParams} params
     * @returns {BigNumber}
     */
    static getMinimalAmountIn(params) {
        const reserve = (0, utils_1.toBigNumber)(params.reserve).applyDecimals(params.decimals);
        const reserveOpposite = (0, utils_1.toBigNumber)(params.reserveOpposite).applyDecimals(params.decimalsOpposite);
        const halfDecimals = (decimals) => (0, utils_1.toBigNumber)(1).applyDecimals(Math.floor(decimals / 2));
        const minimalAmountInByToken = halfDecimals(params.decimals);
        const minimalAmountInByOpposite = halfDecimals(params.decimalsOpposite)
            .multipliedBy(reserve)
            .dividedBy(reserveOpposite);
        return bignumber_js_1.default.max(minimalAmountInByToken, minimalAmountInByOpposite).dp(params.decimals, bignumber_js_1.default.ROUND_CEIL);
    }
    /**
     * Calculate the Liquidity Position for given amounts of a pair of tokens that is going to be added.
     * @param {Liquidity.GetPositionParams} params
     * @returns {BigNumber}
     */
    static getPosition(params) {
        var _a;
        const slippage = (0, utils_1.toBigNumber)((_a = params.slippage) !== null && _a !== void 0 ? _a : __1.Default.SLIPPAGE)
            .dividedBy(100)
            .toNumber();
        const amount0Desired = (0, utils_1.toBigNumber)(params.amount0).removeDecimals(params.decimals0);
        const amount1Desired = (0, utils_1.toBigNumber)(params.amount1).removeDecimals(params.decimals1);
        const amount0Min = amount0Desired.applyTolerance(slippage, 'min').dp(0);
        const amount1Min = amount1Desired.applyTolerance(slippage, 'min').dp(0);
        const reserve0 = (0, utils_1.toBigNumber)(params.reserve0);
        const reserve1 = (0, utils_1.toBigNumber)(params.reserve1);
        const totalSupply = (0, utils_1.toBigNumber)(params.totalSupply);
        let amount0;
        let amount1;
        if (reserve0.isZero() && reserve1.isZero()) {
            amount0 = amount0Desired;
            amount1 = amount1Desired;
        }
        else {
            const amount1Optimal = amount0Desired
                .multipliedBy(reserve1)
                .dividedBy(reserve0);
            if (amount1Desired.isGreaterThanOrEqualTo(amount1Optimal)) {
                if (!amount1Optimal.isGreaterThanOrEqualTo(amount1Min)) {
                    throw new Error('Invalid amount0');
                }
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            }
            else {
                const amount0Optimal = amount1Desired
                    .multipliedBy(reserve0)
                    .dividedBy(reserve1);
                if (!amount0Optimal.isLessThanOrEqualTo(amount0Desired) ||
                    !amount0Optimal.isGreaterThanOrEqualTo(amount0Min)) {
                    throw new Error('Invalid amount1');
                }
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
        }
        let lp;
        if (totalSupply.isZero()) {
            lp = amount0.multipliedBy(amount1).sqrt().minus(this.MINIMUM_LIQUIDITY);
        }
        else {
            const one = amount0.times(totalSupply).div(reserve0);
            const two = amount1.times(totalSupply).div(reserve1);
            lp = bignumber_js_1.default.min(one, two);
        }
        return lp.dp(0);
    }
    /**
     * Calculate Share of a pool of the position based on total supply.
     * @param {Liquidity.GetShareOfPoolParams} params
     * @returns {BigNumber}
     */
    static getShareOfPool(params) {
        const totalSupply = (0, utils_1.toBigNumber)(params.totalSupply);
        if (totalSupply.isZero()) {
            return new bignumber_js_1.default(1);
        }
        const lp = this.getPosition(params);
        const percentage = lp.dividedBy(lp.plus(totalSupply));
        return percentage;
    }
    /**
     * Calculate the amount of a token in a position based on total supply.
     * @param {Liquidity.GetUserPositionValueParams} params
     * @returns {BigNumber}
     **/
    static getUserPositionValue(params) {
        const price0 = (0, utils_1.toBigNumber)(params.price0);
        const price1 = (0, utils_1.toBigNumber)(params.price1);
        const reserve0 = (0, utils_1.toBigNumber)(params.reserve0);
        const reserve1 = (0, utils_1.toBigNumber)(params.reserve1);
        const userShares = (0, utils_1.toBigNumber)(params.userShares);
        const totalShares = (0, utils_1.toBigNumber)(params.totalShares);
        const object = {
            price0,
            price1,
            reserve0,
            reserve1,
            userShares,
            totalShares,
        };
        if ((0, __1.checkIfObject)(object, { isNotANumber: true, isZero: true })) {
            return (0, utils_1.toBigNumber)(0);
        }
        const token0Price = price0.multipliedBy(reserve0.applyDecimals(params.decimals0));
        const token1Price = price1.multipliedBy(reserve1.applyDecimals(params.decimals1));
        const priceByLP = token0Price.plus(token1Price).dividedBy(totalShares);
        return userShares.multipliedBy(priceByLP).dp(this.PAIR_DECIMALS);
    }
    /**
     * Calculate the token balances for given pair Liquidity Position.
     * @param {Liquidity.GetTokenBalancesParams} params
     * @returns {Liquidity.GetTokenBalancesResult}
     */
    static getTokenBalances(params) {
        const reserve0 = (0, utils_1.toBigNumber)(params.reserve0);
        const reserve1 = (0, utils_1.toBigNumber)(params.reserve1);
        const totalSupply = (0, utils_1.toBigNumber)(params.totalSupply);
        const lpBalance = (0, utils_1.toBigNumber)(params.lpBalance);
        const object = { reserve0, reserve1, totalSupply, lpBalance };
        if ((0, __1.checkIfObject)(object, { isNotANumber: true, isZero: true })) {
            return {
                balance0: (0, utils_1.toBigNumber)(0),
                balance1: (0, utils_1.toBigNumber)(0),
            };
        }
        const balancePercentage = lpBalance.dividedBy(totalSupply);
        const balance0 = reserve0
            .multipliedBy(balancePercentage)
            .applyDecimals(params.decimals0)
            .dp(params.decimals0);
        const balance1 = reserve1
            .multipliedBy(balancePercentage)
            .applyDecimals(params.decimals1)
            .dp(params.decimals1);
        return { balance0, balance1 };
    }
}
exports.Liquidity = Liquidity;
/**
 * Constant from Swap Canister.
 */
Liquidity.MINIMUM_LIQUIDITY = 1000;
Liquidity.PAIR_DECIMALS = 8;
//# sourceMappingURL=liquidity.js.map