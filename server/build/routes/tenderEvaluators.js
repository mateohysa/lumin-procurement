"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const jwtAuth_js_1 = require("../middleware/jwtAuth.js");
const tenderEvaluatorRoute = (0, express_1.Router)();
tenderEvaluatorRoute.get('/tender/evaluators', jwtAuth_js_1.authenticateJWT, async (req, res) => {
    try {
        console.log('GET /api/evaluators endpoint hit');
        const evaluators = await userModel_js_1.default.find({ role: 'evaluator' }).select('_id name email role avatar');
        console.log(`Found ${evaluators.length} evaluators in database`);
        return res.status(200).json(evaluators);
    }
    catch (error) {
        console.error('Error fetching evaluators:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching evaluators'
        });
    }
});
exports.default = tenderEvaluatorRoute;
