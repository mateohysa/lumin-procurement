import { Request, Response, NextFunction } from 'express';

export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated())
    return next();
  const message = 'not authenticated, srry';
  console.log(message)
  res.json({ success: false, message });
}

export function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated())
    return next();
  const message = 'already authenticated';
  console.log(message)
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