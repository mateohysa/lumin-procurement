import { Router, Request, Response } from "express";
import User from "../models/userModel.js";
import { authenticateJWT } from "../middleware/jwtAuth.js";

const tenderEvaluatorRoute = Router();

// Route to get all evaluators - protected with JWT
tenderEvaluatorRoute.get('/tender/evaluators', authenticateJWT, async (req: Request, res: Response) => {
  try {
    console.log('GET /api/evaluators endpoint hit');
    
    // Find all users with role 'evaluator'
    const evaluators = await User.find({ role: 'evaluator' }).select('_id name email role avatar');
    console.log(`Found ${evaluators.length} evaluators in database`);
    
    return res.status(200).json(evaluators);
  } catch (error) {
    console.error('Error fetching evaluators:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching evaluators'
    });
  }
});


export default tenderEvaluatorRoute;