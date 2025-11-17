"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyPairs = void 0;
const utils_1 = require("./");
/**
 * Remove pairs without reserves from Pair.List.
 * @param {Pair.List} pairList
 * @returns {Pair.List}
 */
const removeEmptyPairs = (pairList) => {
    const filledPairs = {};
    Object.entries(pairList).forEach(([token0, paired]) => {
        filledPairs[token0] = {};
        Object.entries(paired).forEach(([token1, pair]) => {
            if ((0, utils_1.toBigNumber)(pair.reserve0).gt(0) &&
                (0, utils_1.toBigNumber)(pair.reserve1).gt(0)) {
                filledPairs[token0][token1] = pair;
            }
        });
    });
    return filledPairs;
};
exports.removeEmptyPairs = removeEmptyPairs;
//# sourceMappingURL=pairs.js.map