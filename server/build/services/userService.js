"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = insertUser;
exports.findUserById = findUserById;
exports.findUserbyUsername = findUserbyUsername;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
async function insertUser(user) {
    try {
        const newUser = new userModel_js_1.default(user);
        const savedUser = await newUser.save();
        console.log(savedUser);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
async function findUserById(id) {
    try {
        const user = await userModel_js_1.default.findById(id);
        return user ?? null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
async function findUserbyUsername(username) {
    try {
        const user = await userModel_js_1.default.findOne({ username });
        return user ?? null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
