"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userService_1 = require("../services/userService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const checkAuth_1 = require("../middleware/checkAuth");
const route = (0, express_1.Router)();
;
route.use((0, express_1.json)());
route.use(checkAuth_1.checkNotAuthenticated);
route.post('/', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required',
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const username = req.body.email;
        const user = {
            username: username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            name: req.body.name
        };
        const success = await (0, userService_1.insertUser)(user);
        if (success) {
            console.log('Successfully added user:', user);
            res.status(201).send({
                success: true,
                message: 'User successfully added',
                data: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name
                },
            });
        }
        else
            res.status(500).send({
                success: false,
                message: 'User not added successfully',
                error: 'Failed to insert user into database',
            });
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send({
            success: false,
            message: 'Problem adding user',
            error: error.message || 'An unexpected error occurred',
        });
    }
});
exports.default = route;
