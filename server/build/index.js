"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_config_1 = require("./config/db.config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jwtAuth_1 = require("./middleware/jwtAuth");
const login_1 = __importDefault(require("./routes/login"));
const register_1 = __importDefault(require("./routes/register"));
const tenders_1 = __importDefault(require("./routes/tenders"));
const evaluators_1 = __importDefault(require("./routes/evaluators"));
(0, db_config_1.connectDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true
}));
app.use('/api/login', login_1.default);
app.use('/api/register', register_1.default);
app.use('/api/tenders', tenders_1.default);
app.use('/api/evaluators', evaluators_1.default);
app.use('/api/evaluators', evaluators_1.default);
app.get('/api/profile', jwtAuth_1.authenticateJWT, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});
app.get('/api/vendor/dashboard', jwtAuth_1.authenticateJWT, jwtAuth_1.isVendor, (req, res) => {
    res.json({
        success: true,
        message: 'Vendor dashboard data',
        data: {}
    });
});
app.get('/api/evaluator/dashboard', jwtAuth_1.authenticateJWT, jwtAuth_1.isEvaluator, (req, res) => {
    res.json({
        success: true,
        message: 'Evaluator dashboard data',
        data: {}
    });
});
app.get('/api/manager/dashboard', jwtAuth_1.authenticateJWT, jwtAuth_1.isProcurementManager, (req, res) => {
    res.json({
        success: true,
        message: 'Procurement Manager dashboard data',
        data: {}
    });
});
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
