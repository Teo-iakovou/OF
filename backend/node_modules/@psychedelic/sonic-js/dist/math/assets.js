"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const __1 = require("..");
/**
 * Math calculations for Assets functions.
 */
class Assets {
    /**
     * Calculates the maximal amount of tokens that can be deposited from given token balance.
     * The calculation applies the token fee twice.
     * Fee paid for approval and fee paid for deposit.
     * @param {Assets.GetDepositAmountParams} params
     * @returns {BigNumber}
     */
    static getDepositAmount(params) {
        const fee = (0, __1.toBigNumber)(params.token.fee).applyDecimals(params.token.decimals);
        const amount = (0, __1.toBigNumber)(params.amount, {
            validate: { isNegative: true },
        }).plus(fee.multipliedBy(2));
        if (amount.lte(0))
            return (0, __1.toBigNumber)(0);
        return amount;
    }
    /**
     * Calculates the resultant amount of tokens after sonic withdraw.
     * The calculation applies the token fee.
     * @param {Assets.GetWithdrawAmountParams} params
     * @returns {BigNumber}
     */
    static getWithdrawAmount(params) {
        const fee = (0, __1.toBigNumber)(params.token.fee).applyDecimals(params.token.decimals);
        const amount = (0, __1.toBigNumber)(params.amount, {
            validate: { isNegative: true },
        }).minus(fee);
        if (amount.lte(0))
            return (0, __1.toBigNumber)(0);
        return amount;
    }
}
exports.Assets = Assets;
//# sourceMappingURL=assets.js.map