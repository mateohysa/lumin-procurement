"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, callback) => {
    const allowedFileTypes = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
        '.jpg', '.jpeg', '.png', '.gif',
        '.zip', '.rar',
    ];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
        callback(null, true);
    }
    else {
        callback(new Error('Invalid file type. Only documents, images, and archives are allowed.'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
exports.default = upload;
