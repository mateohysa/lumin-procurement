import mongoose, { Document, Schema } from 'mongoose';

interface ITender extends Document {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  status: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
  createdBy: mongoose.Types.ObjectId;
  attachments: Array<{
    fileName: string;
    fileKey: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  evaluationCriteria: Array<{
    name: string;
    weight: number;
  }>;
  assignedEvaluators: mongoose.Types.ObjectId[];
  winner?: mongoose.Types.ObjectId;
  disputeTimeFrame: number;
  createdAt: Date;
  updatedAt: Date;
}

const tenderSchema = new Schema<ITender>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'open', 'closed', 'awarded', 'cancelled'],
      default: 'open',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    evaluationCriteria: [
      {
        name: String,
        weight: Number,
      },
    ],
    assignedEvaluators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
    },
    disputeTimeFrame: {
      type: Number,
      default: 7, // 7 days
    },
  },
  {
    timestamps: true,
  }
);

const Tender = mongoose.model<ITender>('Tender', tenderSchema);

export default Tender;
export { ITender };