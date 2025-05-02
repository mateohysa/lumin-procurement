// db.js (or config/db.js)
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if(!process.env.MONGO_URI){
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected...');
  } catch (err: any) {
    if( err instanceof Error){
      console.error('MongoDB Connection Error:', err.message);
    }
    // Exit process with failure
    process.exit(1);
  }
};

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

// connectDB();

// export default mongoose.connection;