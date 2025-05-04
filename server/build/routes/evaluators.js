"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const evaluatorsRoute = (0, express_1.Router)();
evaluatorsRoute.get('/', async (req, res) => {
    try {
        const evaluators = await userModel_js_1.default.find({ role: 'evaluator' }).select('name email role avatar');
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
exports.default = evaluatorsRoute;
