"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const __1 = require("..");
/**
 * Math calculations for Price functions.
 */
class Price {
    /**
     * Calculate the total amount price by a given amount
     * @param {Price.GetByAmountParams} params
     * @returns {BigNumber}
     */
    static getByAmount(params) {
        if (!params.amount && !params.price)
            return (0, __1.toBigNumber)(0);
        const amount = (0, __1.toBigNumber)(params.amount);
        const price = (0, __1.toBigNumber)(params.price);
        if (amount.isZero() || price.isZero())
            return (0, __1.toBigNumber)(0);
        return amount.multipliedBy(price);
    }
}
exports.Price = Price;
//# sourceMappingURL=price.js.map