"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReverseMaximalPaths = exports.findMaximalPaths = void 0;
const math_1 = require("../math");
const utils_1 = require("./");
/**
 * Maximal paths graph solver.
 * @param {Pair.List} pairList
 * @param {Token.MetadataList} tokenList
 * @param {Token.Metadata} source
 * @param {BigNumber} initialAmount
 * @returns {MaximalPaths.NodeList}
 */
const findMaximalPaths = (pairList, tokenList, source, initialAmount) => {
    const nodes = Object.keys(pairList).reduce((_nodes, tokenId) => {
        return {
            ..._nodes,
            [tokenId]: {
                id: tokenId,
                amountOut: (0, utils_1.toBigNumber)(-1),
                path: new Set(),
            },
        };
    }, {});
    const getNeighborsWeights = (node, pathDistance) => {
        const neighborsIds = Object.keys(pairList[node.id]);
        return neighborsIds.reduce((weightItems, neighborId) => {
            const weight = math_1.Swap.getAmountOut({
                amountIn: pathDistance.toString(),
                decimalsIn: tokenList[node.id].decimals,
                decimalsOut: tokenList[neighborId].decimals,
                reserveIn: pairList[node.id][neighborId].reserve0,
                reserveOut: pairList[node.id][neighborId].reserve1,
            });
            return {
                ...weightItems,
                [neighborId]: weight,
            };
        }, {});
    };
    const testNode = (node, path = new Set(), pathDistance = initialAmount, pathWeightList = {}) => {
        const previousId = [...path].pop();
        const newPathDistance = previousId ? pathWeightList[node.id] : pathDistance;
        const newPath = new Set([...path, node.id]);
        if (newPathDistance.gt(node.amountOut)) {
            node.amountOut = newPathDistance;
            node.path = newPath;
        }
        for (const neighborId in pairList[node.id]) {
            const neighbor = nodes[neighborId];
            if (!path.has(neighborId)) {
                testNode(neighbor, newPath, newPathDistance, getNeighborsWeights(node, newPathDistance));
            }
        }
    };
    testNode(nodes[source]);
    return nodes;
};
exports.findMaximalPaths = findMaximalPaths;
/**
 * Reverse maximal paths graph solver.
 * @param {Pair.List} pairList
 * @param {Token.MetadataList} tokenList
 * @param {Token.Metadata} source
 * @param {BigNumber} initialAmount
 * @returns {MaximalPaths.NodeList}
 */
const findReverseMaximalPaths = (pairList, tokenList, source, initialAmount) => {
    const nodes = Object.keys(pairList).reduce((_nodes, tokenId) => {
        return {
            ..._nodes,
            [tokenId]: {
                id: tokenId,
                amountOut: (0, utils_1.toBigNumber)(Infinity),
                path: new Set(),
            },
        };
    }, {});
    const getNeighborsWeights = (node, pathDistance) => {
        const neighborsIds = Object.keys(pairList[node.id]);
        return neighborsIds.reduce((weightItems, neighborId) => {
            const weight = math_1.Swap.getAmountIn({
                amountOut: pathDistance.toString(),
                decimalsIn: tokenList[neighborId].decimals,
                decimalsOut: tokenList[node.id].decimals,
                reserveIn: pairList[neighborId][node.id].reserve0,
                reserveOut: pairList[neighborId][node.id].reserve1,
            });
            return {
                ...weightItems,
                [neighborId]: weight,
            };
        }, {});
    };
    const testNode = (node, path = new Set(), pathDistance = initialAmount, pathWeightList = {}) => {
        const previousId = [...path].pop();
        const newPathDistance = previousId ? pathWeightList[node.id] : pathDistance;
        const newPath = new Set([...path, node.id]);
        if (newPathDistance.lt(node.amountOut)) {
            node.amountOut = newPathDistance;
            node.path = newPath;
        }
        for (const neighborId in pairList[node.id]) {
            const neighbor = nodes[neighborId];
            if (!path.has(neighborId)) {
                testNode(neighbor, newPath, newPathDistance, getNeighborsWeights(node, newPathDistance));
            }
        }
    };
    testNode(nodes[source]);
    return nodes;
};
exports.findReverseMaximalPaths = findReverseMaximalPaths;
//# sourceMappingURL=maximal-paths.js.map