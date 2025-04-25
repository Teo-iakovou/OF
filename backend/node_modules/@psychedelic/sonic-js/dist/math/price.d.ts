import BigNumber from 'bignumber.js';
import { Types } from '..';
/**
 * Math calculations for Price functions.
 */
export declare class Price {
    /**
     * Calculate the total amount price by a given amount
     * @param {Price.GetByAmountParams} params
     * @returns {BigNumber}
     */
    static getByAmount(params: Price.GetByAmountParams): BigNumber;
}
/**
 * Type definition for the Price.
 */
export declare namespace Price {
    /**
     * Type definition for getByAmount function params.
     * @param {Types.Amount} amount Amount of the token
     * @param {Types.Amount} price Price of a single token
     */
    type GetByAmountParams = {
        amount?: Types.Amount;
        price?: Types.Number;
    };
}
