import express from 'express';
import { 
  createTender, 
  findTenderById, 
  findTenders, 
  updateTender, 
  deleteTender, 
  findOpenTenders,
  findTendersForEvaluator,
  findTendersEndingSoon,
  findTendersByUser,
  findTendersByCategory,
  countTendersByStatus,
  getRecentTenderActivity
} from '../services/tenderService.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

/**
 * @route GET /api/tenders
 * @desc Get all tenders with optional filtering
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { status, category, createdBy, limit, skip } = req.query;
    
    const options = {
      status: status as any,
      category: category as string,
      createdBy: createdBy as string,
      limit: limit ? parseInt(limit as string) : undefined,
      skip: skip ? parseInt(skip as string) : undefined
    };
    
    const tenders = await findTenders(options);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/open
 * @desc Get all open tenders
 * @access Public
 */
router.get('/open', async (req, res) => {
  try {
    const tenders = await findOpenTenders();
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching open tenders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/evaluator/:evaluatorId
 * @desc Get tenders assigned to a specific evaluator
 * @access Private
 */
router.get('/evaluator/:evaluatorId', checkAuth, async (req, res) => {
  try {
    const { evaluatorId } = req.params;
    const tenders = await findTendersForEvaluator(evaluatorId);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders for evaluator:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/:id
 * @desc Get tender by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const tender = await findTenderById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    res.json(tender);
  } catch (error) {
    console.error('Error fetching tender by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/tenders
 * @desc Create a new tender
 * @access Private
 */
router.post('/', checkAuth, async (req, res) => {
  try {
    console.log('Received tender data:', JSON.stringify(req.body, null, 2));
    console.log('User in request:', req.user);
    
    // Prepare tender data from request
    // Map frontend field names to database field names if needed
    const tenderData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      budget: parseFloat(req.body.budget) || 0,
      deadline: req.body.deadline || req.body.submissionDeadline, // Handle different field names
      status: req.body.status || 'draft',
      createdBy: req.user?._id, // Added optional chaining in case req.user is undefined
      documents: req.body.documents || [],
      evaluationCriteria: req.body.evaluationCriteria || [],
      assignedEvaluators: req.body.assignedEvaluators || 
                         req.body.selectedEvaluators?.map(id => id) || []
    };
    
    console.log('Processed tender data for DB:', JSON.stringify(tenderData, null, 2));
    
    const { tender, error } = await createTender(tenderData);
    
    if (error) {
      console.error('Validation error:', error);
      return res.status(400).json({ message: error });
    }
    
    if (!tender) {
      console.error('Tender creation failed but no error was returned');
      return res.status(400).json({ message: 'Failed to create tender' });
    }
    
    console.log('Successfully created tender:', tender._id);
    res.status(201).json(tender);
  } catch (error) {
    // More detailed error logging
    console.error('Error creating tender:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route PUT /api/tenders/:id
 * @desc Update a tender
 * @access Private
 */
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const tender = await findTenderById(req.params.id);
    
    // Check if tender exists
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    // Check if user is the creator of the tender
    if (tender.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this tender' });
    }
    
    const updatedTender = await updateTender(req.params.id, req.body);
    res.json(updatedTender);
  } catch (error) {
    console.error('Error updating tender:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route DELETE /api/tenders/:id
 * @desc Delete a tender
 * @access Private
 */
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const tender = await findTenderById(req.params.id);
    
    // Check if tender exists
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    // Check if user is the creator of the tender
    if (tender.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this tender' });
    }
    
    const deleted = await deleteTender(req.params.id);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete tender' });
    }
    
    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('Error deleting tender:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/ending-soon/:days
 * @desc Get tenders ending within a specified number of days
 * @access Public
 */
router.get('/ending-soon/:days?', async (req, res) => {
  try {
    const days = req.params.days ? parseInt(req.params.days) : 7;
    const tenders = await findTendersEndingSoon(days);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders ending soon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/user/:userId
 * @desc Get tenders created by a specific user
 * @access Private
 */
router.get('/user/:userId', checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own tenders or if they have admin privileges
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these tenders' });
    }
    
    const tenders = await findTendersByUser(userId);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching user tenders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/category/:category
 * @desc Get tenders by category
 * @access Public
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const tenders = await findTendersByCategory(category);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/stats/by-status
 * @desc Get count of tenders by status
 * @access Public
 */
router.get('/stats/by-status', async (req, res) => {
  try {
    const stats = await countTendersByStatus();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching tender stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tenders/recent-activity
 * @desc Get recent tender activity
 * @access Public
 */
router.get('/recent-activity', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const tenders = await getRecentTenderActivity(limit);
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching recent tender activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;