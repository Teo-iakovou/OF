import BigNumber from 'bignumber.js';
export declare namespace Types {
    /**
     * It receives all possible representations of a number. (e.g. integer, float, percentage, bigint)
     */
    type Number = BigInt | string | number | BigNumber;
    /**
     * It is a string that represents the number that is shown on user interfaces. (e.g. token amount, money amount)
     */
    type Amount = string;
    /**
     * It is always a integer that represents the decimals allowed on a DIP20 token.
     */
    type Decimals = number;
}
