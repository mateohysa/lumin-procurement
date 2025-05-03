import mongoose, { Document, Schema } from 'mongoose';

interface IEvaluation extends Document {
  tender: mongoose.Types.ObjectId;
  submission: mongoose.Types.ObjectId;
  evaluator: mongoose.Types.ObjectId;
  scores: Array<{
    criteriaId: string;
    criteriaName: string;
    score: number;
    weight: number;
    comments: string;
  }>;
  totalScore: number;
  status: 'pending' | 'in-progress' | 'completed';
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>(
  {
    tender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Tender',
    },
    submission: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Submission',
    },
    evaluator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    scores: [
      {
        criteriaId: String,
        criteriaName: String,
        score: Number,
        weight: Number,
        comments: String,
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model<IEvaluation>('Evaluation', evaluationSchema);

export default Evaluation;
export { IEvaluation };