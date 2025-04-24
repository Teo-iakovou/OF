declare module 'bignumber.js' {
    interface BigNumber {
        toBigInt(): bigint;
        applyDecimals(decimals: number): BigNumber;
        removeDecimals(decimals: number): BigNumber;
        applyTolerance(percentage: number, type?: 'min' | 'max'): BigNumber;
    }
}
export {};
