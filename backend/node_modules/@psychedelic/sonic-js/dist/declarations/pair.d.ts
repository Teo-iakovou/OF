import { SwapIDL } from "./";
import { Types } from '..';
export declare namespace Pair {
    /**
     * Type definition for a pair.
     */
    type Metadata = SwapIDL.PairInfoExt;
    /**
     * Type definition for a list of pairs.
     * It is represented using nested object in the structure of:
     * [canisterId][canisterId]: Metadata
     */
    type List = {
        [canisterId: string]: {
            [canisterId: string]: Metadata;
        };
    };
    /**
     * Type definition for a pair Liquidity Position balance.
     */
    type Balance = Types.Number;
    /**
     * Type definition for a list of pair Liquidity Position balances.
     */
    type Balances = {
        [pairId: string]: Balance;
    };
}
