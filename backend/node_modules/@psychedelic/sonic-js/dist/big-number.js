"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("./utils");
bignumber_js_1.default.config({ EXPONENTIAL_AT: 99, ROUNDING_MODE: bignumber_js_1.default.ROUND_FLOOR });
/**
 * Transforms BigNumber into bigint.
 * @returns {bigint}
 */
bignumber_js_1.default.prototype.toBigInt = function () {
    return BigInt(this.toString());
};
/**
 * Apply decimals to a number.
 * @param {number} decimals Decimals to apply
 * @returns {BigNumber}
 */
bignumber_js_1.default.prototype.applyDecimals = function (decimals) {
    return this.dividedBy((0, utils_1.toExponential)(decimals)).dp(decimals);
};
/**
 * Removes decimals from a number.
 * @param {number} decimals Decimals to remove
 * @returns {BigNumber}
 */
bignumber_js_1.default.prototype.removeDecimals = function (decimals) {
    return this.dp(decimals).multipliedBy((0, utils_1.toExponential)(decimals));
};
/**
 * Returns the number for a given maximal/minimal tolerance.
 * @param {number} percentage Tolerance percentage
 * @param {'min' | 'max'='max'} type Tolerance under or above
 * @returns {BigNumber}
 */
bignumber_js_1.default.prototype.applyTolerance = function (percentage, type = 'min') {
    const toleranceCoefficient = new bignumber_js_1.default(1).plus(percentage * (type === 'max' ? 1 : -1));
    return this.multipliedBy(toleranceCoefficient);
};
//# sourceMappingURL=big-number.js.map