/**
 * Parses a json string into an object.
 * This is required for parsing objects that have BigInt values.
 * @param {string} jsonString JSON string to parse
 * @returns {object | undefined}
 */
export declare const deserialize: <T = any>(jsonString: string) => T | undefined;
/**
 * Parses a json object into a string.
 * This is required for parsing objects that have BigInt values.
 * @param {any} data object to parse
 * @returns {string}
 */
export declare const serialize: <T>(data: T) => string;
