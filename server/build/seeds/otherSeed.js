"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
const tenderModel_1 = __importDefault(require("../models/tenderModel"));
const submissionModel_1 = __importDefault(require("../models/submissionModel"));
const evaluationModel_1 = __importDefault(require("../models/evaluationModel"));
const disputeModel_1 = __importDefault(require("../models/disputeModel"));
const db_config_1 = require("../config/db.config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
(0, db_config_1.connectDB)();
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        avatar: 'AU',
    },
    {
        name: 'Vendor Company',
        email: 'vendor@example.com',
        password: 'password123',
        role: 'vendor',
        avatar: 'VC',
    },
    {
        name: 'Tech Solutions Inc.',
        email: 'techsolutions@example.com',
        password: 'password123',
        role: 'vendor',
        avatar: 'TS',
    },
    {
        name: 'Office Suppliers Ltd.',
        email: 'officesuppliers@example.com',
        password: 'password123',
        role: 'vendor',
        avatar: 'OS',
    },
    {
        name: 'Evaluator One',
        email: 'evaluator1@example.com',
        password: 'password123',
        role: 'evaluator',
        avatar: 'EO',
    },
    {
        name: 'Evaluator Two',
        email: 'evaluator2@example.com',
        password: 'password123',
        role: 'evaluator',
        avatar: 'ET',
    },
];
const tenders = [
    {
        title: 'Office Equipment Procurement',
        description: 'Supply and installation of office equipment including computers, printers, and furniture.',
        category: 'IT Equipment',
        budget: 50000,
        deadline: '2025-06-30',
        requirements: [
            'Must provide at least 3-year warranty',
            'Must include installation services',
            'Must provide training for staff',
            'Must be energy efficient'
        ],
        status: 'open',
        createdAt: '2025-04-01',
    },
    {
        title: 'Building Renovation',
        description: 'Renovation of the main office building including painting, flooring, and electrical work.',
        category: 'Construction',
        budget: 150000,
        deadline: '2025-07-15',
        requirements: [
            'Must have previous experience in commercial buildings',
            'Must provide all materials',
            'Must complete work within 45 days',
            'Must be licensed and insured'
        ],
        status: 'closed',
        createdAt: '2025-03-15',
    },
    {
        title: 'IT Security Services',
        description: 'Implementation of security measures including firewall, intrusion detection, and security audits.',
        category: 'IT Services',
        budget: 75000,
        deadline: '2025-08-01',
        requirements: [
            'Must have certified security professionals',
            'Must provide 24/7 monitoring',
            'Must include quarterly security assessments',
            'Must have experience with government clients'
        ],
        status: 'open',
        createdAt: '2025-04-10',
    },
    {
        title: 'Marketing Campaign',
        description: 'Development and execution of a marketing campaign for new product launch.',
        category: 'Marketing',
        budget: 100000,
        deadline: '2025-06-15',
        requirements: [
            'Must include digital and traditional marketing',
            'Must provide analytics and reporting',
            'Must have experience in the industry',
            'Must include creative development'
        ],
        status: 'open',
        createdAt: '2025-04-05',
    },
];
const importData = async () => {
    try {
        await userModel_1.default.deleteMany();
        await tenderModel_1.default.deleteMany();
        await submissionModel_1.default.deleteMany();
        await evaluationModel_1.default.deleteMany();
        await disputeModel_1.default.deleteMany();
        const usersPromise = users.map(async (u) => {
            const password = await bcryptjs_1.default.hash(u.password, 10);
            return { ...u, password };
        });
        const usersResolve = await Promise.all(usersPromise);
        const createdUsers = await userModel_1.default.insertMany(usersResolve);
        const adminId = createdUsers[0]._id;
        const vendorIds = createdUsers.filter(user => user.role === 'vendor').map(user => user._id);
        const evaluatorIds = createdUsers.filter(user => user.role === 'evaluator').map(user => user._id);
        const createdTenders = await tenderModel_1.default.insertMany(tenders.map(tender => ({
            ...tender,
            createdBy: adminId
        })));
        console.log('Tenders created:', createdTenders);
        return;
        const submissions = [];
        for (let i = 0; i < createdTenders.length; i++) {
            const tender = createdTenders[i];
            for (let j = 0; j < Math.min(2, vendorIds.length); j++) {
                const vendorId = vendorIds[j];
                submissions.push({
                    tenderId: tender._id,
                    vendorId,
                    documents: [
                        {
                            name: 'Technical Proposal',
                            type: 'pdf',
                            size: '3.2 MB',
                            url: '#'
                        },
                        {
                            name: 'Financial Proposal',
                            type: 'pdf',
                            size: '1.8 MB',
                            url: '#'
                        },
                        {
                            name: 'Company Profile',
                            type: 'pdf',
                            size: '2.5 MB',
                            url: '#'
                        }
                    ],
                    technicalDetails: {
                        approach: 'Our approach focuses on efficiency and quality.',
                        timeline: '45 days from project initiation',
                        team: 'Senior team with over 15 years of experience'
                    },
                    financialDetails: {
                        totalCost: tender.budget * 0.9,
                        breakdown: {
                            materials: tender.budget * 0.5,
                            labor: tender.budget * 0.3,
                            overhead: tender.budget * 0.1
                        }
                    },
                    submissionDate: new Date(),
                    status: i === 0 ? 'Evaluated' : 'Submitted'
                });
            }
        }
        const createdSubmissions = await submissionModel_1.default.insertMany(submissions);
        const evaluations = [];
        const firstTenderSubmissions = createdSubmissions.filter(sub => sub.tenderId.toString() === createdTenders[0]._id.toString());
        for (const submission of firstTenderSubmissions) {
            for (const evaluatorId of evaluatorIds) {
                const technical = Math.floor(Math.random() * 25) + 70;
                const financial = Math.floor(Math.random() * 25) + 70;
                const experience = Math.floor(Math.random() * 25) + 70;
                const implementation = Math.floor(Math.random() * 25) + 70;
                const overallScore = (technical + financial + experience + implementation) / 4;
                evaluations.push({
                    submissionId: submission._id,
                    evaluatorId,
                    scores: {
                        technical,
                        financial,
                        experience,
                        implementation
                    },
                    comments: 'This is a evaluation comment for testing purposes.',
                    overallScore,
                    evaluationDate: new Date()
                });
            }
        }
        await evaluationModel_1.default.insertMany(evaluations);
        await disputeModel_1.default.create({
            tenderId: createdTenders[1]._id,
            vendorId: vendorIds[0],
            reason: 'Our bid was more cost-effective and included additional services that were not considered in the evaluation.',
            disputeType: 'rejection',
            status: 'pending',
            createdAt: new Date()
        });
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await userModel_1.default.deleteMany();
        await tenderModel_1.default.deleteMany();
        await submissionModel_1.default.deleteMany();
        await evaluationModel_1.default.deleteMany();
        await disputeModel_1.default.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
