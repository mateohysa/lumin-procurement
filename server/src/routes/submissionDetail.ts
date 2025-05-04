import express from 'express';
import { Request, Response } from 'express';
import { checkAuthenticated } from '../middleware/checkAuth.js';
import Submission from '../models/submissionModel.js';
import Tender from '../models/tenderModel.js';

const router = express.Router();

/**
 * @route   GET /api/submissions/:id
 * @desc    Get a single submission by ID
 * @access  Private
 */
router.get('/:id', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    // Fetch submission and populate vendor and tender with assigned evaluators
    const submission = await Submission.findById(req.params.id)
      .populate('vendor', 'name email avatar')
      .populate({
        path: 'tender',
        select: 'title assignedEvaluators status',
        populate: { path: 'assignedEvaluators', select: 'name email avatar' }
      });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    // Convert to plain object
    const submissionObj = submission.toObject() as any;
    // Restrict access: admin and evaluators cannot view if tender is still open
    const user = req.user as any;
    if (submissionObj.tender.status === 'open' && (user.role === 'admin' || user.role === 'evaluator')) {
      return res.status(403).json({ message: 'Not allowed to view this submission while tender is open' });
    }
    // Prepare mock evaluator scores on a 1-10 scale per criterion
    const evaluators = submissionObj.tender.assignedEvaluators || [];
    const criteriaNames = ['technical', 'financial', 'experience', 'implementation'];
    const mockEvaluations: any[] = evaluators.map((ev: any, idx: number) => {
      const scores: Record<string, number> = {};
      // Assign mock score (10 - evaluator index, minimum 1)
      criteriaNames.forEach((c) => {
        scores[c] = Math.max(1, 10 - idx);
      });
      const overallScore =
        criteriaNames.reduce((sum, c) => sum + scores[c], 0) / criteriaNames.length;
      return {
        evaluatorId: ev._id,
        evaluatorName: ev.name,
        scores,
        comments: `Mock comment by ${ev.name}`,
        overallScore,
        rank: 0,
      };
    });
    // Sort and assign ranks
    mockEvaluations.sort((a, b) => b.overallScore - a.overallScore);
    mockEvaluations.forEach((ev, i) => { ev.rank = i + 1; });
    // Compute submission average score
    const averageScore = mockEvaluations.reduce((sum, ev) => sum + ev.overallScore, 0)
      / (mockEvaluations.length || 1);
    // Attach mock data
    submissionObj.evaluations = mockEvaluations;
    submissionObj.averageScore = parseFloat(averageScore.toFixed(2));
    submissionObj.overallRank = 1; // Single submission in detail view
    return res.json(submissionObj);
  } catch (error) {
    console.error(`Error finding submission with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 