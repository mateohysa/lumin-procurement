"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFileUrl = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3_config_js_1 = __importStar(require("../config/aws/s3.config.js"));
const uuid_1 = require("uuid");
const uploadFile = async (file, originalName, contentType) => {
    try {
        const fileExtension = originalName.split('.').pop();
        const key = `${(0, uuid_1.v4)()}.${fileExtension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: s3_config_js_1.S3_BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
        });
        await s3_config_js_1.default.send(command);
        const url = await (0, exports.getFileUrl)(key);
        return { key, url };
    }
    catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};
exports.uploadFile = uploadFile;
const getFileUrl = async (key, expiresIn = 3600) => {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: s3_config_js_1.S3_BUCKET_NAME,
            Key: key,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3_config_js_1.default, command, { expiresIn });
        return url;
    }
    catch (error) {
        console.error('Error generating presigned URL:', error);
        throw new Error('Failed to generate file access URL');
    }
};
exports.getFileUrl = getFileUrl;
const deleteFile = async (key) => {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: s3_config_js_1.S3_BUCKET_NAME,
            Key: key,
        });
        await s3_config_js_1.default.send(command);
        return true;
    }
    catch (error) {
        console.error('Error deleting file from S3:', error);
        return false;
    }
};
exports.deleteFile = deleteFile;
