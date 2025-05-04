"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTender = createTender;
exports.findTenderById = findTenderById;
exports.findTenders = findTenders;
exports.updateTender = updateTender;
exports.deleteTender = deleteTender;
exports.findTendersForEvaluator = findTendersForEvaluator;
exports.findOpenTenders = findOpenTenders;
const mongoose_1 = __importDefault(require("mongoose"));
const tenderModel_js_1 = __importDefault(require("../models/tenderModel.js"));
async function createTender(tenderData) {
    try {
        const tender = new tenderModel_js_1.default(tenderData);
        const savedTender = await tender.save();
        return savedTender;
    }
    catch (error) {
        console.error('Error creating tender:', error);
        return null;
    }
}
async function findTenderById(id) {
    try {
        const tender = await tenderModel_js_1.default.findById(id);
        return tender;
    }
    catch (error) {
        console.error(`Error finding tender with id ${id}:`, error);
        return null;
    }
}
async function findTenders(options = {}) {
    try {
        const query = {};
        if (options.status) {
            query.status = options.status;
        }
        if (options.category) {
            query.category = options.category;
        }
        if (options.createdBy) {
            query.createdBy = new mongoose_1.default.Types.ObjectId(options.createdBy);
        }
        let tenderQuery = tenderModel_js_1.default.find(query);
        if (options.skip) {
            tenderQuery = tenderQuery.skip(options.skip);
        }
        if (options.limit) {
            tenderQuery = tenderQuery.limit(options.limit);
        }
        const tenders = await tenderQuery.exec();
        return tenders;
    }
    catch (error) {
        console.error('Error finding tenders:', error);
        return [];
    }
}
async function updateTender(id, updateData) {
    try {
        const updatedTender = await tenderModel_js_1.default.findByIdAndUpdate(id, updateData, { new: true });
        return updatedTender;
    }
    catch (error) {
        console.error(`Error updating tender with id ${id}:`, error);
        return null;
    }
}
async function deleteTender(id) {
    try {
        const result = await tenderModel_js_1.default.findByIdAndDelete(id);
        return !!result;
    }
    catch (error) {
        console.error(`Error deleting tender with id ${id}:`, error);
        return false;
    }
}
async function findTendersForEvaluator(evaluatorId) {
    try {
        const tenders = await tenderModel_js_1.default.find({
            assignedEvaluators: new mongoose_1.default.Types.ObjectId(evaluatorId),
            status: 'closed',
        });
        return tenders;
    }
    catch (error) {
        console.error(`Error finding tenders for evaluator ${evaluatorId}:`, error);
        return [];
    }
}
async function findOpenTenders() {
    try {
        const tenders = await tenderModel_js_1.default.find({
            status: 'open',
        });
        console.log(`Found ${tenders.length} open tenders`);
        return tenders;
    }
    catch (error) {
        console.error('Error finding open tenders:', error);
        return [];
    }
}
