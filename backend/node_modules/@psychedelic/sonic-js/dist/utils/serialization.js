"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.deserialize = void 0;
/**
 * Parses a json string into an object.
 * This is required for parsing objects that have BigInt values.
 * @param {string} jsonString JSON string to parse
 * @returns {object | undefined}
 */
const deserialize = (jsonString) => {
    try {
        return JSON.parse(jsonString, (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.substring(0, value.length - 1));
            }
            return value;
        });
    }
    catch {
        return undefined;
    }
};
exports.deserialize = deserialize;
/**
 * Parses a json object into a string.
 * This is required for parsing objects that have BigInt values.
 * @param {any} data object to parse
 * @returns {string}
 */
const serialize = (data) => {
    try {
        return JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value);
    }
    catch {
        return '';
    }
};
exports.serialize = serialize;
//# sourceMappingURL=serialization.js.map