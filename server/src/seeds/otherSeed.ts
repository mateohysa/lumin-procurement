import dotenv from 'dotenv';
import User from '../models/userModel';
import Tender from '../models/tenderModel';
import Submission from '../models/submissionModel';
import Evaluation from '../models/evaluationModel';
import Dispute from '../models/disputeModel';
import {connectDB} from '../config/db.config';
import bcrypt from 'bcryptjs';

dotenv.config();

connectDB();

// User data
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

// Tender data
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

// Function to seed the database
const importData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Tender.deleteMany();
    await Submission.deleteMany();
    await Evaluation.deleteMany();
    await Dispute.deleteMany();

    // Insert users
    const usersPromise = users.map( async (u) => {
      const password = await bcrypt.hash(u.password, 10);
      return {...u, password};
    });
    const usersResolve = await Promise.all(usersPromise);

    const createdUsers = await User.insertMany(usersResolve);
    
    // Get user IDs by role for reference
    const adminId = createdUsers[0]._id;
    const vendorIds = createdUsers.filter(user => user.role === 'vendor').map(user => user._id);
    const evaluatorIds = createdUsers.filter(user => user.role === 'evaluator').map(user => user._id);
    
    // Create tenders with the admin as creator
    const createdTenders = await Tender.insertMany(
      tenders.map(tender => ({
        ...tender,
        createdBy: adminId
      }))
    );
    console.log('Tenders created:', createdTenders);
    return;
    
    // Create submissions
    const submissions = [];
    
    // For each tender, create 1-2 submissions from different vendors
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
            totalCost: tender.budget * 0.9, // 90% of budget as example
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
    
    const createdSubmissions = await Submission.insertMany(submissions);
    
    // Create evaluations for the first tender's submissions
    const evaluations = [];
    
    // Only create evaluations for submissions of the first tender (Office Equipment)
    const firstTenderSubmissions = createdSubmissions.filter(
      sub => sub.tenderId.toString() === createdTenders[0]._id.toString()
    );
    
    for (const submission of firstTenderSubmissions) {
      for (const evaluatorId of evaluatorIds) {
        // Generate random scores between 70-95
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
    
    await Evaluation.insertMany(evaluations);
    
    // Create a dispute for the second tender
    await Dispute.create({
      tenderId: createdTenders[1]._id,
      vendorId: vendorIds[0],
      reason: 'Our bid was more cost-effective and included additional services that were not considered in the evaluation.',
      disputeType: 'rejection',
      status: 'pending',
      createdAt: new Date()
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Function to destroy all data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Tender.deleteMany();
    await Submission.deleteMany();
    await Evaluation.deleteMany();
    await Dispute.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}