"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
/**
 * Default values used on Sonic-js library.
 */
exports.Default = {
    // URL used for communicating with IC
    IC_HOST: 'https://boundary.ic0.app/',
    // Swap Canister Id
    SWAP_CANISTER_ID: '3xwpq-ziaaa-aaaah-qcn4a-cai',
    // Slippage percentage applied in transactions (0.5%)
    SLIPPAGE: 0.5,
    // Set to "development" to enable development features
    ENV: ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) || 'production',
};
//# sourceMappingURL=default.js.map