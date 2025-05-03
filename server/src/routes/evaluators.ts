import { Router, Request, Response } from "express";
import User from "../models/userModel.js";
import { isEvaluator, isProcurementManager } from "../middleware/checkAuth.js";

const evaluatorsRoute = Router();

// Route to get all evaluators
evaluatorsRoute.get('/', async (req: Request, res: Response) => {
  try {
    // Find all users with role 'evaluator'
    const evaluators = await User.find({ role: 'evaluator' }).select('name email role avatar');
    
    return res.status(200).json(evaluators);
  } catch (error) {
    console.error('Error fetching evaluators:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching evaluators'
    });
  }
});

export default evaluatorsRoute;