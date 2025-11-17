"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmount = exports.toExponential = exports.toBigNumber = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * Converts a value to a BigNumber.
 * @param {Types.Number} num
 * @param {ToBigNumberOptions} options
 * @returns {BigNumber}
 */
const toBigNumber = (num, options) => {
    const value = new bignumber_js_1.default(Number(num || 0));
    const { validate } = options || {};
    const zero = new bignumber_js_1.default(0);
    if (value.isZero()) {
        if (validate === null || validate === void 0 ? void 0 : validate.isEmpty) {
            throw new Error('Value cannot be empty');
        }
        else {
            return zero;
        }
    }
    if (value.isNaN()) {
        if (validate === null || validate === void 0 ? void 0 : validate.isNotANumber) {
            throw new Error('Value cannot be NaN');
        }
        else {
            return zero;
        }
    }
    if ((validate === null || validate === void 0 ? void 0 : validate.isNegative) && value.isNegative())
        throw new Error('Value cannot be negative');
    return value;
};
exports.toBigNumber = toBigNumber;
/**
 * Create an exponential notation by given decimals.
 * @param {Types.Number} decimals
 * @returns {BigNumber}
 */
const toExponential = (decimals) => {
    return new bignumber_js_1.default(10).pow((0, exports.toBigNumber)(decimals));
};
exports.toExponential = toExponential;
const fixStringEnding = (str) => {
    return str.replace(/0+$/, '').replace(/\.$/, '');
};
/**
 * Formats an amount to a small string with scientific notation
 * @param {Types.Amount} amount
 * @returns {string}
 */
const formatAmount = (amount) => {
    const [nat = '0', decimals = '0'] = amount.replace(/^0+/, '').split('.');
    const isNegative = Math.sign(Number(amount)) === -1;
    const thousands = Math.floor(Math.log10(Math.abs(Number(nat))));
    if (thousands < 3) {
        if (!Number(nat) && /^00/.test(decimals)) {
            return `${isNegative ? '> -' : '< '}0.01`;
        }
        return fixStringEnding(`${nat || 0}.${decimals.slice(0, 2)}`);
    }
    else if (thousands < 6) {
        return fixStringEnding(`${nat.slice(0, -3)}.${nat.slice(-3, -1)}`) + 'k';
    }
    else if (thousands < 9) {
        return fixStringEnding(`${nat.slice(0, -6)}.${nat.slice(-6, -4)}`) + 'M';
    }
    else {
        return `${isNegative ? '< -' : '> '}999M`;
    }
};
exports.formatAmount = formatAmount;
//# sourceMappingURL=format.js.map