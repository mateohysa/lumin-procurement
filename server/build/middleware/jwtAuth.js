"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.isVendor = isVendor;
exports.isEvaluator = isEvaluator;
exports.isProcurementManager = isProcurementManager;
const jwt_1 = require("../utils/jwt");
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }
    const token = authHeader.split(' ')[1];
    const result = (0, jwt_1.verifyToken)(token);
    if (!result.success) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
    req.user = result.data;
    next();
}
function isRoleHelper(role, req, res, next) {
    if (req.user && req.user.role === role) {
        return next();
    }
    return res.status(403).json({ success: false, message: `Forbidden: User is not a ${role}` });
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
