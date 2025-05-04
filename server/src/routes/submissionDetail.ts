import express from 'express';
import { Request, Response } from 'express';
import { checkAuthenticated } from '../middleware/checkAuth.js';
import Submission from '../models/submissionModel.js';

const router = express.Router();

/**
 * @route   GET /api/submissions/:id
 * @desc    Get a single submission by ID
 * @access  Private
 */
router.get('/:id', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('vendor', 'name email avatar')
      .populate('tender', 'title');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    console.error(`Error finding submission with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 