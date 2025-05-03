import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // It's crucial to handle password hashing properly in a real application!
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to omit this field
  },
  role: {
    type: String,
    enum: ['ProcurementManager', 'Vendor', 'Evaluator'],
    default: 'Vendor',
  }
});

const MyUser = mongoose.model('User', userSchema);

export { MyUser };
export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {_id: string};
export type UserDtos = Pick<UserDocument, 'username' | 'password' | 'email' | 'role'>; // Example DTO