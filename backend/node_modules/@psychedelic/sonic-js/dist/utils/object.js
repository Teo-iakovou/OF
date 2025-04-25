"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfObject = void 0;
/**
 * Checking if all values in object are valid
 * @param {{[key: string]: BigNumber}} obj Object with BigNumber to be validated
 * @param {CheckIfOptions} options
 */
function checkIfObject(object, options) {
    let isMatch = false;
    const values = Object.values(object);
    for (const value of values) {
        if (options.isZero && value.isZero()) {
            isMatch = true;
        }
        if (options.isNotANumber && value.isNaN()) {
            isMatch = true;
        }
        if (options.isNegative && value.isNegative()) {
            isMatch = true;
        }
    }
    return isMatch;
}
exports.checkIfObject = checkIfObject;
//# sourceMappingURL=object.js.map