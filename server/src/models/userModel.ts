import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  // username: string;
  password: string;
  email: string;
  role: 'procurement_manager' | 'vendor' | 'evaluator' | 'admin';
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
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
      enum: ['procurement_manager', 'vendor', 'evaluator', 'admin'],
      default: 'vendor',
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
export type UserRegisterDto = Pick<IUser,  'email' | 'role' | 'name' | 'password'>; // Ky eshte vetem objekti per register