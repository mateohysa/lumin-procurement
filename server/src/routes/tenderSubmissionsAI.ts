import express from 'express';
import { Request, Response } from 'express';
import Submission from '../models/submissionModel.js';
import { checkAuthenticated } from '../middleware/checkAuth.js';
import { extractScores, queryEvaluateProposals } from '../services/aiService.js';
import Tender from '../models/tenderModel.js';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  // we will have some kind of id for tenders with which we filter the ones we need for the particular page
  const tenderId = req.params.id; // /id
  const tender = await Tender.findById(tenderId);
  if (!tender) {
    return res.status(404).json({ success: false, message: 'Tender not found' });
  }
  const submissions = await Submission.find({ tender: tender._id });

  const submissionData = submissions.map( e => JSON.stringify(e));
  const queryEvaluateResult = await queryEvaluateProposals(JSON.stringify(tender), submissionData);

  if (!queryEvaluateResult.success){
    return res.status(300).json({
      success: false,
      message: queryEvaluateResult.message
    });
  }
  const text = queryEvaluateResult.text ; 
  const submissionScores = await extractScores(text);

  const finalSubmissionArray = submissions.map( (data, index) => ({...data, aiScore: submissionScores[index]}));

  return res.status(200).json({
    success: true,
    aiEvaluationDescription: queryEvaluateResult.text,
    submissions: finalSubmissionArray
  });
});

export default router;