import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from './src/models/submissionModel';
import Tender from './src/models/tenderModel';
import User from './src/models/userModel';
import type { ISubmission } from './src/models/submissionModel';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mateo:FfHRNcsBsbVjcvMK@cluster0.xgmeluc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seedSubmissions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB at', MONGO_URI);

    // Clear existing submissions
    await Submission.deleteMany({});
    console.log('Cleared existing submissions');

    // Fetch a subset of vendors and tenders from the current DB
    const vendors = await User.find({ role: 'vendor' }).limit(10).exec();
    const tenders = await Tender.find().limit(5).exec();

    console.log(vendors);
    console.log(tenders);
    if (vendors.length === 0 || tenders.length === 0) {
      throw new Error('No vendors or tenders found. Make sure users and tenders are seeded.');
    }

    const submissionsToInsert: Partial<ISubmission>[] = [];

    // Create a few submissions for each tender
    tenders.forEach((tender) => {
      // Pick up to 3 random vendors for each tender
      const sampleVendors = vendors
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(vendors.length, 3));

      sampleVendors.forEach((vendor) => {
        // Generate sample attachments
        const sampleAttachments = [
          {
            fileName: `proposal_${vendor.name || vendor.email}.pdf`,
            fileKey: `proposals/${tender._id}/${vendor._id}/proposal.pdf`,
            fileUrl: `https://example.com/proposals/${tender._id}/${vendor._id}/proposal.pdf`,
            fileType: 'application/pdf',
            fileSize: Math.floor(50000 + Math.random() * 100000),
          },
          {
            fileName: `budget_${vendor.name || vendor.email}.xlsx`,
            fileKey: `proposals/${tender._id}/${vendor._id}/budget.xlsx`,
            fileUrl: `https://example.com/proposals/${tender._id}/${vendor._id}/budget.xlsx`,
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fileSize: Math.floor(20000 + Math.random() * 50000),
          },
        ];
        // Generate evaluation scores per assigned evaluator and criteria
        const evaluationScores: ISubmission['evaluationScores'] = [];
        if (tender.assignedEvaluators?.length && tender.evaluationCriteria?.length) {
          tender.assignedEvaluators.forEach((evalId) => {
            tender.evaluationCriteria.forEach((criteria) => {
              evaluationScores.push({
                criteriaId: (criteria as any)._id?.toString() || criteria.name,
                criteriaName: criteria.name,
                score: Math.floor(1 + Math.random() * 9),
                evaluator: evalId as mongoose.Types.ObjectId,
                comments: `Auto-generated score for ${criteria.name}`,
              });
            });
          });
        }
        // Calculate average score
        const averageScore =
          evaluationScores.length > 0
            ? evaluationScores.reduce((sum, s) => sum + s.score, 0) / evaluationScores.length
            : 0;
        submissionsToInsert.push({
          tender: tender._id as mongoose.Types.ObjectId,
          vendor: vendor._id as mongoose.Types.ObjectId,
          proposedBudget: Math.floor(
            tender.budget * (0.5 + Math.random() * 0.5)
          ),
          proposal: `This is a proposal by ${vendor.name || vendor.email} for tender '${tender.title}'`,
          attachments: sampleAttachments,
          status: 'pending',
          evaluationScores,
          averageScore,
        });
      });
    });

    const inserted = await Submission.insertMany(submissionsToInsert);
    console.log('Inserted submissions count:', inserted.length);
  } catch (error) {
    console.error('Error seeding submissions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedSubmissions(); 