import mongoose, { Document, Schema } from 'mongoose';

interface IDispute extends Document {
  tender: mongoose.Types.ObjectId;
  submission?: mongoose.Types.ObjectId;
  raisedBy: mongoose.Types.ObjectId;
  againstWinner?: mongoose.Types.ObjectId;
  type: 'rejection' | 'winner';
  reason: string;
  evidence: Array<{
    name: string;
    url: string;
  }>;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  resolution?: string;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    tender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Tender',
    },
    submission: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
    },
    raisedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    againstWinner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: ['rejection', 'winner'],
    },
    reason: {
      type: String,
      required: true,
    },
    evidence: [
      {
        name: String,
        url: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolution: {
      type: String,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Dispute = mongoose.model<IDispute>('Dispute', disputeSchema);

export default Dispute;
export { IDispute };