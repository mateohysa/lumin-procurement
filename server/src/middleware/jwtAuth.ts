import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// Define a custom interface for the JWT payload
interface JwtPayload {
  id: string;
  username: string;
  email?: string;
  role: "ProcurementManager" | "Vendor" | "Evaluator";
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware to verify JWT token
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }

  // Extract token (format: "Bearer TOKEN")
  const token = authHeader.split(' ')[1];
  
  // Verify the token
  const result = verifyToken(token);
  
  if (!result.success) {
    return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
  }
  
  // Add user data to the request object
  req.user = result.data as JwtPayload;
  
  // Continue to the next middleware or route handler
  next();
}

// Role-based middleware
type UserRoles = "ProcurementManager" | "Vendor" | "Evaluator";

function isRoleHelper(role: UserRoles, req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.role === role) {
    return next();
  }
  return res.status(403).json({ success: false, message: `Forbidden: User is not a ${role}` });
}

export function isVendor(req: Request, res: Response, next: NextFunction) {
  return isRoleHelper('Vendor', req, res, next);
}

export function isEvaluator(req: Request, res: Response, next: NextFunction) {
  return isRoleHelper('Evaluator', req, res, next);
}

export function isProcurementManager(req: Request, res: Response, next: NextFunction) {
  return isRoleHelper('ProcurementManager', req, res, next);
}