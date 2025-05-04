"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            process.exit(1);
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('MongoDB Connection Error:', err.message);
        }
        process.exit(1);
    }
};
exports.connectDB = connectDB;
async function disconnectDatabase() {
    try {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}
