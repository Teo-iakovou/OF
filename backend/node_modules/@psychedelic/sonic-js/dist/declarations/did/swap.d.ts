import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';
export declare class SwapIDL {
    static readonly factory: IDL.InterfaceFactory;
}
export declare namespace SwapIDL {
    interface DSwapInfo {
        storageCanisterId: Principal;
        owner: Principal;
        cycles: bigint;
        tokens: Array<TokenInfoExt>;
        pairs: Array<PairInfoExt>;
    }
    interface PairInfoExt {
        id: string;
        price0CumulativeLast: bigint;
        creator: Principal;
        reserve0: bigint;
        reserve1: bigint;
        lptoken: string;
        totalSupply: bigint;
        token0: string;
        token1: string;
        price1CumulativeLast: bigint;
        kLast: bigint;
        blockTimestampLast: bigint;
    }
    type Result = {
        ok: boolean;
    } | {
        err: string;
    };
    interface Swap {
        addAuth: (arg_0: Principal) => Promise<boolean>;
        addLiquidity: (arg_0: Principal, arg_1: Principal, arg_2: bigint, arg_3: bigint, arg_4: bigint, arg_5: bigint, arg_6: bigint) => Promise<TxReceipt>;
        addToken: (arg_0: Principal) => Promise<Result>;
        allowance: (arg_0: string, arg_1: Principal, arg_2: Principal) => Promise<bigint>;
        approve: (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<boolean>;
        balanceOf: (arg_0: string, arg_1: Principal) => Promise<bigint>;
        checkTxCounter: () => Promise<boolean>;
        createPair: (arg_0: Principal, arg_1: Principal) => Promise<TxReceipt>;
        decimals: (arg_0: string) => Promise<number>;
        deposit: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
        depositTo: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
        getAllPairs: () => Promise<Array<PairInfoExt>>;
        getDSwapInfo: () => Promise<DSwapInfo>;
        getLPTokenId: (arg_0: Principal, arg_1: Principal) => Promise<string>;
        getNumPairs: () => Promise<bigint>;
        getPair: (arg_0: Principal, arg_1: Principal) => Promise<[] | [PairInfoExt]>;
        getPairs: (arg_0: bigint, arg_1: bigint) => Promise<[Array<PairInfoExt>, bigint]>;
        getSupportedTokenList: () => Promise<Array<TokenInfoExt>>;
        getSupportedTokenListByName: (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<[Array<TokenInfoExt>, bigint]>;
        getSupportedTokenListSome: (arg_0: bigint, arg_1: bigint) => Promise<[Array<TokenInfoExt>, bigint]>;
        getUserBalances: (arg_0: Principal) => Promise<Array<[string, bigint]>>;
        getUserInfo: (arg_0: Principal) => Promise<UserInfo>;
        getUserInfoAbove: (arg_0: Principal, arg_1: bigint, arg_2: bigint) => Promise<UserInfo>;
        getUserInfoByNamePageAbove: (arg_0: Principal, arg_1: bigint, arg_2: string, arg_3: bigint, arg_4: bigint, arg_5: bigint, arg_6: string, arg_7: bigint, arg_8: bigint) => Promise<UserInfoPage>;
        getUserLPBalances: (arg_0: Principal) => Promise<Array<[string, bigint]>>;
        getUserLPBalancesAbove: (arg_0: Principal, arg_1: bigint) => Promise<Array<[string, bigint]>>;
        lazySwap: (arg_0: bigint, arg_1: bigint, arg_2: Array<string>, arg_3: Principal) => Promise<TxReceipt>;
        name: (arg_0: string) => Promise<string>;
        removeAuth: (arg_0: Principal) => Promise<boolean>;
        removeLiquidity: (arg_0: Principal, arg_1: Principal, arg_2: bigint, arg_3: bigint, arg_4: bigint, arg_5: Principal, arg_6: bigint) => Promise<TxReceipt>;
        setAddTokenThresh: (arg_0: bigint) => Promise<boolean>;
        setFeeForToken: (arg_0: string, arg_1: bigint) => Promise<boolean>;
        setFeeOn: (arg_0: boolean) => Promise<boolean>;
        setFeeTo: (arg_0: Principal) => Promise<boolean>;
        setGlobalTokenFee: (arg_0: bigint) => Promise<boolean>;
        setMaxTokens: (arg_0: bigint) => Promise<boolean>;
        setOwner: (arg_0: Principal) => Promise<boolean>;
        setStorageCanisterId: (arg_0: Principal) => Promise<boolean>;
        swapExactTokensForTokens: (arg_0: bigint, arg_1: bigint, arg_2: Array<string>, arg_3: Principal, arg_4: bigint) => Promise<TxReceipt>;
        swapTokensForExactTokens: (arg_0: bigint, arg_1: bigint, arg_2: Array<string>, arg_3: Principal, arg_4: bigint) => Promise<TxReceipt>;
        symbol: (arg_0: string) => Promise<string>;
        totalSupply: (arg_0: string) => Promise<bigint>;
        transfer: (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<boolean>;
        transferFrom: (arg_0: string, arg_1: Principal, arg_2: Principal, arg_3: bigint) => Promise<boolean>;
        withdraw: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
        withdrawTo: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
    }
    interface TokenInfoExt {
        id: string;
        fee: bigint;
        decimals: number;
        name: string;
        totalSupply: bigint;
        symbol: string;
    }
    type TxReceipt = {
        ok: bigint;
    } | {
        err: string;
    };
    interface UserInfo {
        lpBalances: Array<[string, bigint]>;
        balances: Array<[string, bigint]>;
    }
    interface UserInfoPage {
        lpBalances: [Array<[string, bigint]>, bigint];
        balances: [Array<[string, bigint]>, bigint];
    }
    type Factory = Swap;
}
