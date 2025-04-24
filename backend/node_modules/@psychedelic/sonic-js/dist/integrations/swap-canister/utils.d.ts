import { Pair, SwapIDL, Token } from "../../declarations";
/**
 * Parses a list of supported tokens from swap canister request.
 * @param {SwapIDL.TokenInfoExt[]} response Response from swap canister
 * @returns {Token.MetadataList}
 */
export declare const parseSupportedTokenList: (response: SwapIDL.TokenInfoExt[]) => Token.MetadataList;
/**
 * Parses a list of pairs from swap canister request.
 * @param {SwapIDL.PairInfoExt[]} response Response from swap canister
 * @returns {Pair.List}
 */
export declare const parseAllPairs: (response: SwapIDL.PairInfoExt[]) => Pair.List;
/**
 * Parses a list of pairs LP balances from swap canister request.
 * @param {[string, bigint][]} response Response from swap canister
 * @returns {Pair.Balances}
 */
export declare const parseUserLPBalances: (response: [string, bigint][]) => Pair.Balances;
/**
 * Get deadline for swap canister requests.
 * @returns {bigint}
 */
export declare const getDeadline: () => bigint;
