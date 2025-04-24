"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeadline = exports.parseUserLPBalances = exports.parseAllPairs = exports.parseSupportedTokenList = void 0;
const index_1 = require("../../index");
/**
 * Parses a list of supported tokens from swap canister request.
 * @param {SwapIDL.TokenInfoExt[]} response Response from swap canister
 * @returns {Token.MetadataList}
 */
const parseSupportedTokenList = (response) => {
    return response.reduce((parsed, item) => {
        return {
            ...parsed,
            [item.id]: item,
        };
    }, {});
};
exports.parseSupportedTokenList = parseSupportedTokenList;
/**
 * Parses a list of pairs from swap canister request.
 * @param {SwapIDL.PairInfoExt[]} response Response from swap canister
 * @returns {Pair.List}
 */
const parseAllPairs = (response) => {
    return response.reduce((list, pair) => {
        const { token0, token1, reserve0, reserve1 } = pair;
        if (Number(reserve0) === 0 && Number(reserve1) === 0) {
            return list;
        }
        return {
            ...list,
            [token0]: {
                ...list[token0],
                [token1]: pair,
            },
            [token1]: {
                ...list[token1],
                [token0]: {
                    ...pair,
                    token0: token1,
                    token1: token0,
                    reserve0: reserve1,
                    reserve1: reserve0,
                },
            },
        };
    }, {});
};
exports.parseAllPairs = parseAllPairs;
/**
 * Parses a list of pairs LP balances from swap canister request.
 * @param {[string, bigint][]} response Response from swap canister
 * @returns {Pair.Balances}
 */
const parseUserLPBalances = (response) => {
    return response.reduce((balances, [pairId, balance]) => {
        return {
            ...balances,
            [pairId]: (0, index_1.toBigNumber)(balance),
        };
    }, {});
};
exports.parseUserLPBalances = parseUserLPBalances;
/**
 * Get deadline for swap canister requests.
 * @returns {bigint}
 */
const getDeadline = () => {
    return BigInt((new Date().getTime() + 5 * 60 * 1000) * 10000000);
};
exports.getDeadline = getDeadline;
//# sourceMappingURL=utils.js.map