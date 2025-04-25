import { Pair, Token } from "../declarations";
import BigNumber from 'bignumber.js';
/**
 * Maximal paths graph solver.
 * @param {Pair.List} pairList
 * @param {Token.MetadataList} tokenList
 * @param {Token.Metadata} source
 * @param {BigNumber} initialAmount
 * @returns {MaximalPaths.NodeList}
 */
export declare const findMaximalPaths: MaximalPaths.GraphResolver;
/**
 * Reverse maximal paths graph solver.
 * @param {Pair.List} pairList
 * @param {Token.MetadataList} tokenList
 * @param {Token.Metadata} source
 * @param {BigNumber} initialAmount
 * @returns {MaximalPaths.NodeList}
 */
export declare const findReverseMaximalPaths: MaximalPaths.GraphResolver;
/**
 * Type definition for the maximal paths graph solver.
 */
export declare namespace MaximalPaths {
    /**
     * Weight list for graph nodes.
     */
    type WeightList = {
        [tokenId: string]: BigNumber;
    };
    /**
     * Type definition for Node object.
     */
    type Node = {
        id: string;
        amountOut: BigNumber;
        path: Set<string>;
    };
    /**
     * Type definition for NodeList object.
     */
    type NodeList = {
        [tokenId: string]: Node;
    };
    /**
     * Type definition for Path object.
     */
    type Path = {
        amountOut: BigNumber;
        path: string[];
    };
    /**
     * Type definition for PathList object.
     */
    type PathList = {
        [tokenId: string]: Path;
    };
    /**
     * Type definition for a GraphResolver function.
     */
    type GraphResolver = (pairList: Pair.List, tokenList: Token.MetadataList, source: string, initialAmount: BigNumber) => NodeList;
}
