import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    const message = 'not authenticated, no token provided';
    console.log(message);
    return res.json({ success: false, message });
  }

  // Extract token (format: "Bearer TOKEN")
  const token = authHeader.split(' ')[1];
  
  // Verify the token
  const result = verifyToken(token);
  
  if (!result.success) {
    const message = 'not authenticated, invalid token';
    console.log(message);
    return res.json({ success: false, message });
  }
  
  // Add user data to the request object
  req.user = result.data;
  return next();
}

export function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const result = verifyToken(token);
  
  if (!result.success) {
    return next();
  }
  
  const message = 'already authenticated';
  console.log(message);
  res.json({ success: false, message });
}

type UserRoles = "ProcurementManager" | "Vendor" | "Evaluator";

function isRoleHelper(role:  UserRoles, req: Request, res: Response, next: NextFunction){
  if (req.user && req.user.role === role)
    return next();
  res.json({success: false, message: `User is not ${role}`});
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