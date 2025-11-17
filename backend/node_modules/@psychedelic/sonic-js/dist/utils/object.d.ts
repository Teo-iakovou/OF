import BigNumber from 'bignumber.js';
/**
 * Options for validation.
 */
export declare type CheckIfOptions = {
    isZero?: boolean;
    isNotANumber?: boolean;
    isNegative?: boolean;
};
/**
 * Checking if all values in object are valid
 * @param {{[key: string]: BigNumber}} obj Object with BigNumber to be validated
 * @param {CheckIfOptions} options
 */
export declare function checkIfObject(object: {
    [key: string]: BigNumber;
}, options: CheckIfOptions): boolean;
