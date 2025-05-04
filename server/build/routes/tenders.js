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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const checkAuth_js_1 = require("../middleware/checkAuth.js");
const tenderService = __importStar(require("../services/tenderService.js"));
const fileUpload_js_1 = __importDefault(require("../middleware/fileUpload.js"));
const fileService = __importStar(require("../services/fileService.js"));
const router = express_1.default.Router();
router.post('/', checkAuth_js_1.checkAuthenticated, fileUpload_js_1.default.array('attachments', 5), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('budget').isNumeric().withMessage('Budget must be a number'),
    (0, express_validator_1.body)('submissionDeadline').isISO8601().withMessage('Valid deadline date is required'),
    (0, express_validator_1.body)('evaluationCriteria').isArray().withMessage('Evaluation criteria must be an array'),
    (0, express_validator_1.body)('evaluationCriteria.*.name').notEmpty().withMessage('Criterion name is required'),
    (0, express_validator_1.body)('evaluationCriteria.*.weight').isNumeric().withMessage('Criterion weight must be a number'),
], async (req, res) => {
    console.log(req.body);
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (['procurement_officer', 'admin'].indexOf(req.user.role) === -1) {
            return res.status(403).json({ message: 'Only procurement officers and admin can create tenders' });
        }
        const attachments = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const fileResult = await fileService.uploadFile(file.buffer, file.originalname, file.mimetype);
                attachments.push({
                    fileName: file.originalname,
                    fileKey: fileResult.key,
                    fileUrl: fileResult.url,
                    fileType: file.mimetype,
                    fileSize: file.size,
                });
            }
        }
        console.log(req.user);
        const tenderData = {
            ...req.body,
            createdBy: req.user.id,
            attachments: attachments.length > 0 ? attachments : undefined,
        };
        console.log('Tender data:', tenderData);
        tenderData.deadline = tenderData.submissionDeadline;
        const tender = await tenderService.createTender(tenderData);
        if (!tender) {
            return res.status(500).json({ message: 'Failed to create tender' });
        }
        res.status(201).json(tender);
    }
    catch (error) {
        console.error('Error in create tender route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/open', checkAuth_js_1.checkAuthenticated, async (req, res) => {
    try {
        const openTenders = await tenderService.findOpenTenders();
        console.log(`Found ${openTenders.length} open tenders`);
        res.status(200).json(openTenders);
    }
    catch (error) {
        console.error('Error in get open tenders route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve open tenders'
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const options = {
            status: req.query.status,
            category: req.query.category,
            createdBy: req.query.createdBy,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            skip: req.query.skip ? parseInt(req.query.skip) : undefined,
        };
        const tenders = await tenderService.findTenders(options);
        res.json(tenders);
    }
    catch (error) {
        console.error('Error in get tenders route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const tender = await tenderService.findTenderById(req.params.id);
        if (!tender) {
            return res.status(404).json({ message: 'Tender not found' });
        }
        res.json(tender);
    }
    catch (error) {
        console.error('Error in get tender by id route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/:id', checkAuth_js_1.checkAuthenticated, async (req, res) => {
    try {
        if (['procurement_officer', 'admin'].indexOf(req.user.role) === -1) {
            return res.status(403).json({ message: 'Only procurement officers and admin can create tenders' });
        }
        const tender = await tenderService.updateTender(req.params.id, req.body);
        if (!tender) {
            return res.status(404).json({ message: 'Tender not found' });
        }
        res.json(tender);
    }
    catch (error) {
        console.error('Error in update tender route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', checkAuth_js_1.checkAuthenticated, async (req, res) => {
    try {
        if (['procurement_officer', 'admin'].indexOf(req.user.role) === -1) {
            return res.status(403).json({ message: 'Only procurement officers and admin can create tenders' });
        }
        const success = await tenderService.deleteTender(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Tender not found' });
        }
        res.json({ message: 'Tender deleted successfully' });
    }
    catch (error) {
        console.error('Error in delete tender route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/files', checkAuth_js_1.checkAuthenticated, fileUpload_js_1.default.array('files', 10), async (req, res) => {
    try {
        const uploadedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const fileResult = await fileService.uploadFile(file.buffer, file.originalname, file.mimetype);
                uploadedFiles.push({
                    fileName: file.originalname,
                    fileKey: fileResult.key,
                    fileUrl: fileResult.url,
                    fileType: file.mimetype,
                    fileSize: file.size,
                });
            }
        }
        if (uploadedFiles.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        res.status(200).json({ files: uploadedFiles });
    }
    catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
});
exports.default = router;
