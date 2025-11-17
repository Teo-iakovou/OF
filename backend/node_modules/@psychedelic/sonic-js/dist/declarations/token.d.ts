import BigNumber from 'bignumber.js';
import { Types } from '.';
import { SwapIDL } from './did';
export declare namespace Token {
    /**
     * It is an object containing information about a DIP20 token.
     */
    type Metadata = SwapIDL.TokenInfoExt;
    /**
     * It is key-object that maps a list of `Token.Metadata`.
     */
    type MetadataList = {
        [canisterId: string]: Metadata;
    };
    /**
     * It is an object containing the metadata and an amount of a token.
     * It is used for turn easier pass data on operations.
     */
    interface Data<M = Metadata> {
        metadata?: M;
        amount: Types.Amount;
    }
    /**
     * Type definition for a token balance.
     * @param sonic represents the user's amount deposited on sonic
     * @param token represents the user's amount from wallet
     * @param total represents the sum of sonic and token
     */
    type Balance = {
        sonic: BigNumber;
        token: BigNumber;
        total: BigNumber;
    };
    /**
     * It is key-object that maps a list of `Token.Balance`
     */
    type BalanceList = {
        [canisterId: string]: Balance;
    };
}
