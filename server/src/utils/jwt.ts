import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/userModel.js';

// JWT secret key should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Function to generate a JWT token
export function generateToken(user: UserDocument): string {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  // Sign the token with the secret key and set expiration to 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Function to verify a JWT token
export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}