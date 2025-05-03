import express from 'express';
import { body, validationResult } from 'express-validator';
import { checkAuthenticated } from '../middleware/checkAuth.js';
import * as tenderService from '../services/tenderService.js';

const router = express.Router();

/**
 * @route   POST /api/tenders
 * @desc    Create a new tender
 * @access  Private (Procurement Officers only)
 */
router.post(
  '/',
  checkAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('deadline').isISO8601().withMessage('Valid deadline date is required'),
    body('evaluationCriteria').isArray().withMessage('Evaluation criteria must be an array'),
    body('evaluationCriteria.*.name').notEmpty().withMessage('Criterion name is required'),
    body('evaluationCriteria.*.weight').isNumeric().withMessage('Criterion weight must be a number'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user has appropriate role (assuming user info is in req.user)
      if (req.user.role !== 'procurement_officer') {
        return res.status(403).json({ message: 'Only procurement officers can create tenders' });
      }

      // Add the user ID as the creator
      const tenderData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const tender = await tenderService.createTender(tenderData);
      if (!tender) {
        return res.status(500).json({ message: 'Failed to create tender' });
      }

      res.status(201).json(tender);
    } catch (error) {
      console.error('Error in create tender route:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @route   GET /api/tenders
 * @desc    Get all tenders with optional filtering
 * @access  Public/Private (depending on filters)
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      status: req.query.status as any,
      category: req.query.category as string,
      createdBy: req.query.createdBy as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
    };

    const tenders = await tenderService.findTenders(options);
    res.json(tenders);
  } catch (error) {
    console.error('Error in get tenders route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/tenders/:id
 * @desc    Get a tender by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const tender = await tenderService.findTenderById(req.params.id);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    console.error('Error in get tender by id route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/tenders/:id
 * @desc    Update a tender
 * @access  Private (Procurement Officers only)
 */
router.put('/:id', checkAuthenticated, async (req, res) => {
  try {
    // Check if user has appropriate role
    if (req.user.role !== 'procurement_officer') {
      return res.status(403).json({ message: 'Only procurement officers can update tenders' });
    }

    const tender = await tenderService.updateTender(req.params.id, req.body);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    console.error('Error in update tender route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/tenders/:id
 * @desc    Delete a tender
 * @access  Private (Procurement Officers only)
 */
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    // Check if user has appropriate role
    if (req.user.role !== 'procurement_officer') {
      return res.status(403).json({ message: 'Only procurement officers can delete tenders' });
    }

    const success = await tenderService.deleteTender(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('Error in delete tender route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;