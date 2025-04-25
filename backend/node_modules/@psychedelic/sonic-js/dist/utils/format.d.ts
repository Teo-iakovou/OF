import { Types } from "../declarations";
import BigNumber from 'bignumber.js';
/**
 * Type definition for options of toBigNumber function.
 */
export interface ToBigNumberOptions {
    validate?: {
        isNotANumber?: boolean;
        isEmpty?: boolean;
        isNegative?: boolean;
    };
}
/**
 * Converts a value to a BigNumber.
 * @param {Types.Number} num
 * @param {ToBigNumberOptions} options
 * @returns {BigNumber}
 */
export declare const toBigNumber: (num?: Types.Number | undefined, options?: ToBigNumberOptions | undefined) => BigNumber;
/**
 * Create an exponential notation by given decimals.
 * @param {Types.Number} decimals
 * @returns {BigNumber}
 */
export declare const toExponential: (decimals: Types.Number) => BigNumber;
/**
 * Formats an amount to a small string with scientific notation
 * @param {Types.Amount} amount
 * @returns {string}
 */
export declare const formatAmount: (amount: Types.Amount) => string;
