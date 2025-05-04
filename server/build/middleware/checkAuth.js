"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthenticated = checkAuthenticated;
exports.checkNotAuthenticated = checkNotAuthenticated;
exports.isVendor = isVendor;
exports.isEvaluator = isEvaluator;
exports.isProcurementManager = isProcurementManager;
const jwt_1 = require("../utils/jwt");
function checkAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const message = 'not authenticated, no token provided';
        console.log(message);
        return res.json({ success: false, message });
    }
    const token = authHeader.split(' ')[1];
    const result = (0, jwt_1.verifyToken)(token);
    if (!result.success) {
        const message = 'not authenticated, invalid token';
        console.log(message);
        return res.json({ success: false, message });
    }
    req.user = result.data;
    return next();
}
function checkNotAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    const result = (0, jwt_1.verifyToken)(token);
    if (!result.success) {
        return next();
    }
    const message = 'already authenticated';
    console.log(message);
    res.json({ success: false, message });
}
function isRoleHelper(role, req, res, next) {
    if (req.user && req.user.role === role)
        return next();
    res.json({ success: false, message: `User is not ${role}` });
}
function isVendor(req, res, next) {
    return isRoleHelper('Vendor', req, res, next);
}
function isEvaluator(req, res, next) {
    return isRoleHelper('Evaluator', req, res, next);
}
function isProcurementManager(req, res, next) {
    return isRoleHelper('ProcurementManager', req, res, next);
}
