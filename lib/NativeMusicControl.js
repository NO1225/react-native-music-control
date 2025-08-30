"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
// Use get instead of getEnforcing to avoid forcing codegen
// This will return null if TurboModule is not available/registered
exports.default = react_native_1.TurboModuleRegistry.get('MusicControlManager');
