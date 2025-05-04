import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { checkAuthenticated } from '../middleware/checkAuth.js';
import * as tenderService from '../services/tenderService.js';
import upload from '../middleware/fileUpload.js';
import * as fileService from '../services/fileService.js';

const router = express.Router();

/**
 * @route   POST /api/tenders
 * @desc    Create a new tender
 * @access  Private (Procurement Officers only)
 */
router.post(
  '/',
  checkAuthenticated,
  upload.array('attachments', 5), // Allow up to 5 file attachments
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('submissionDeadline').isISO8601().withMessage('Valid deadline date is required'),
    body('evaluationCriteria').isArray().withMessage('Evaluation criteria must be an array'),
    body('evaluationCriteria.*.name').notEmpty().withMessage('Criterion name is required'),
    body('evaluationCriteria.*.weight').isNumeric().withMessage('Criterion weight must be a number'),
  ],
  async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user has appropriate role (assuming user info is in req.user)
      if ( ['procurement_manager','admin'].indexOf(req.user!.role.toLowerCase()) === -1 ) {
        return res.status(403).json({ message: 'Only procurement officers and admin can create tenders' });
      }

      // Process any uploaded files
      const attachments = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const fileResult = await fileService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype
          );
          attachments.push({
            fileName: file.originalname,
            fileKey: fileResult.key,
            fileUrl: fileResult.url,
            fileType: file.mimetype,
            fileSize: file.size,
          });
        }
      }

      console.log(req.user);

      // Add the user ID as the creator and add attachments
      const tenderData = {
        ...req.body,
        createdBy: req.user!.id,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      console.log('Tender data:', tenderData);
      tenderData.deadline = tenderData.submissionDeadline;
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
 * @route   GET /api/tenders/open
 * @desc    Get all open tenders that vendors can apply to
 * @access  Private (Vendor)
 */
router.get('/open', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const openTenders = await tenderService.findOpenTenders();
    console.log(`Found ${openTenders.length} open tenders`);
    
    // Return tenders directly as an array to match frontend expectations
    res.status(200).json(openTenders);
  } catch (error) {
    console.error('Error in get open tenders route:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve open tenders' 
    });
  }
});

/**
 * @route   GET /api/tenders
 * @desc    Get all tenders with optional filtering
 * @access  Public/Private (depending on filters)
 */
router.get('/', async (req: Request, res: Response) => {
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
router.get('/:id', async (req: Request, res: Response) => {
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
router.put('/:id', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    // Check if user has appropriate role
    if ( ['procurement_manager','admin'].indexOf(req.user!.role) === -1 ) {
      return res.status(403).json({ message: 'Only procurement officers and admin can update tenders' });
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
router.delete('/:id', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    // Check if user has appropriate role
    if ( ['procurement_manager','admin'].indexOf(req.user!.role.toLowerCase()) === -1 ) {
      return res.status(403).json({ message: 'Only procurement officers and admin can delete tenders' });
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

/**
 * @route   POST /api/tenders/files
 * @desc    Upload files and get S3 URLs
 * @access  Private
 */
router.post(
  '/files',
  checkAuthenticated,
  upload.array('files', 10), // Allow up to 10 files
  async (req: Request, res: Response) => {
    try {
      // Process any uploaded files
      const uploadedFiles = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const fileResult = await fileService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype
          );
          uploadedFiles.push({
            fileName: file.originalname,
            fileKey: fileResult.key,
            fileUrl: fileResult.url,
            fileType: file.mimetype,
            fileSize: file.size,
          });
        }
      }

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      res.status(200).json({ files: uploadedFiles });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Server error during file upload' });
    }
  }
);

/**
 * @route   GET /api/tenders/for-evaluation
 * @desc    Get tenders awaiting evaluation by a specific evaluator
 * @access  Private (Evaluator)
 */
router.get('/for-evaluation', checkAuthenticated, async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Evaluator') {
      return res.status(403).json({ message: 'Only evaluators can access this resource' });
    }
    const tenders = await tenderService.findTendersForEvaluator(req.user!.id);
    return res.status(200).json(tenders);
  } catch (error) {
    console.error('Error in get tenders for evaluator route:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/tenders/:id/submissions
 * @desc    Get submissions for a specific tender
 * @access  Private (Procurement Officers only)
 */
router.get(
  '/:id/submissions',
  checkAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const tenderId = req.params.id;
      const user = req.user as any;
      // Fetch tender to retrieve assigned evaluators if needed
      const tender = await tenderService.findTenderById(tenderId);
      if (!tender) {
        return res.status(404).json({ message: 'Tender not found' });
      }
      // Restrict admin and evaluators from viewing submissions when tender is still open
      if (tender.status === 'open' && (user.role === 'admin' || user.role === 'evaluator')) {
        return res.status(403).json({ message: 'Not allowed to view submissions while tender is open' });
      }
      // Fetch submissions for this tender
      const submissions = await tenderService.findSubmissionsByTenderId(tenderId);

      // Map submissions to include submissionDate, mock evaluator scores, averageScore, and computed rank
      const criteriaNames = ['technical', 'financial', 'experience', 'implementation'];
      const enriched = submissions.map((s, idx) => {
        // Convert to plain object
        const obj: any = typeof s.toObject === 'function' ? s.toObject() : { ...s };
        // Map createdAt to submissionDate
        obj.submissionDate = s.createdAt.toISOString();
        // Build mock evaluations for each assigned evaluator
        const evaluators: any[] = Array.isArray(tender.assignedEvaluators)
          ? tender.assignedEvaluators as any[]
          : [];
        const mockEvaluations = evaluators.map((ev, evIdx) => {
          const scores: Record<string, number> = {};
          // Assign static scores per criteria, varying by submission and evaluator index
          criteriaNames.forEach((c) => {
            const baseMap: Record<string, number> = {
              technical: 80,
              financial: 85,
              experience: 90,
              implementation: 95,
            };
            const base = baseMap[c] || 80;
            scores[c] = base - evIdx * 5 - idx * 2;
          });
          const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);
          const overallScore = totalScore / criteriaNames.length;
          return {
            evaluatorId: ev._id,
            evaluatorName: ev.name,
            scores,
            comments: `Mock comment for submission ${idx + 1} by evaluator ${ev.name}`,
            totalScore,
            overallScore,
          };
        });
        // Attach mock evaluations
        obj.evaluations = mockEvaluations;
        // Compute averageScore from mock evaluations
        obj.averageScore = parseFloat(
          (mockEvaluations.reduce((sum, ev) => sum + ev.overallScore, 0) / (mockEvaluations.length || 1)).toFixed(2)
        );
        return obj;
      });
      // Sort by averageScore descending and attach rank
      enriched.sort((a: any, b: any) => b.averageScore - a.averageScore);
      enriched.forEach((obj: any, idx: number) => {
        obj.rank = idx + 1;
      });

      return res.status(200).json(enriched);
    } catch (error) {
      console.error('Error fetching tender submissions:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;