import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  role: 'ProcurementManager' | 'Vendor' | 'Evaluator';
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to omit this field
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ['ProcurementManager', 'Vendor', 'Evaluator'],
      default: 'Vendor',
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default  User;
export { IUser };
export type UserDocument = IUser;
export type UserDto = Pick<IUser, 'username' | 'email' | 'role' | 'name'>;