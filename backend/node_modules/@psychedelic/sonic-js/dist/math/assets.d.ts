import BigNumber from 'bignumber.js';
import { Token, Types } from '..';
/**
 * Math calculations for Assets functions.
 */
export declare class Assets {
    /**
     * Calculates the maximal amount of tokens that can be deposited from given token balance.
     * The calculation applies the token fee twice.
     * Fee paid for approval and fee paid for deposit.
     * @param {Assets.GetDepositAmountParams} params
     * @returns {BigNumber}
     */
    static getDepositAmount(params: Assets.GetDepositAmountParams): BigNumber;
    /**
     * Calculates the resultant amount of tokens after sonic withdraw.
     * The calculation applies the token fee.
     * @param {Assets.GetWithdrawAmountParams} params
     * @returns {BigNumber}
     */
    static getWithdrawAmount(params: Assets.GetWithdrawAmountParams): BigNumber;
}
/**
 * Type definition for the Assets.
 */
export declare namespace Assets {
    /**
     * Type definition for getDepositAmount function params.
     */
    interface GetDepositAmountParams {
        token: Token.Metadata;
        amount: Types.Amount;
    }
    /**
     * Type definition for getWithdrawAmount function params.
     */
    interface GetWithdrawAmountParams {
        token: Token.Metadata;
        amount: Types.Amount;
    }
}
