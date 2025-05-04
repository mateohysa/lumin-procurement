import mongoose, { Document, Schema } from 'mongoose';

interface ISubmission extends Document {
  tender: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  proposedBudget: number;
  proposal: string;
  attachments: Array<{
    fileName: string;
    fileKey: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'awarded';
  evaluationScores: Array<{
    criteriaId: string;
    criteriaName: string;
    score: number;
    evaluator: mongoose.Types.ObjectId;
    comments: string;
  }>;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    tender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Tender'
    },
    vendor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    proposedBudget: {
      type: Number,
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileKey: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'awarded'],
      default: 'pending',
    },
    evaluationScores: [
      {
        criteriaId: String,
        criteriaName: String,
        score: Number,
        evaluator: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        comments: String,
      },
    ],
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);

export default Submission;
export { ISubmission };