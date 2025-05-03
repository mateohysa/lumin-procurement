import mongoose from 'mongoose';
import Tender, { ITender } from '../models/tenderModel.js';

export interface TenderQueryOptions {
  status?: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
  category?: string;
  createdBy?: string;
  limit?: number;
  skip?: number;
}

/**
 * Create a new tender
 */
export async function createTender(tenderData: Partial<ITender>): Promise<ITender | null> {
  try {
    const tender = new Tender(tenderData);
    const savedTender = await tender.save();
    return savedTender;
  } catch (error) {
    console.error('Error creating tender:', error);
    return null;
  }
}

/**
 * Find a tender by its ID
 */
export async function findTenderById(id: string): Promise<ITender | null> {
  try {
    const tender = await Tender.findById(id);
    return tender;
  } catch (error) {
    console.error(`Error finding tender with id ${id}:`, error);
    return null;
  }
}

/**
 * Fetch all tenders with optional filtering
 */
export async function findTenders(options: TenderQueryOptions = {}): Promise<ITender[]> {
  try {
    const query: any = {};
    
    // Apply filters if provided
    if (options.status) {
      query.status = options.status;
    }
    
    if (options.category) {
      query.category = options.category;
    }
    
    if (options.createdBy) {
      query.createdBy = new mongoose.Types.ObjectId(options.createdBy);
    }
    
    // Create the query
    let tenderQuery = Tender.find(query);
    
    // Apply pagination if provided
    if (options.skip) {
      tenderQuery = tenderQuery.skip(options.skip);
    }
    
    if (options.limit) {
      tenderQuery = tenderQuery.limit(options.limit);
    }
    
    // Execute the query
    const tenders = await tenderQuery.exec();
    return tenders;
  } catch (error) {
    console.error('Error finding tenders:', error);
    return [];
  }
}

/**
 * Update a tender by ID
 */
export async function updateTender(id: string, updateData: Partial<ITender>): Promise<ITender | null> {
  try {
    const updatedTender = await Tender.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );
    return updatedTender;
  } catch (error) {
    console.error(`Error updating tender with id ${id}:`, error);
    return null;
  }
}

/**
 * Delete a tender by ID
 */
export async function deleteTender(id: string): Promise<boolean> {
  try {
    const result = await Tender.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting tender with id ${id}:`, error);
    return false;
  }
}

/**
 * Find tenders that are awaiting evaluation by a specific evaluator
 */
export async function findTendersForEvaluator(evaluatorId: string): Promise<ITender[]> {
  try {
    const tenders = await Tender.find({
      assignedEvaluators: new mongoose.Types.ObjectId(evaluatorId),
      status: 'closed', // Assuming 'closed' means ready for evaluation
    });
    return tenders;
  } catch (error) {
    console.error(`Error finding tenders for evaluator ${evaluatorId}:`, error);
    return [];
  }
}

/**
 * Find open tenders that vendors can apply to
 */
export async function findOpenTenders(): Promise<ITender[]> {
  try {
    // Temporarily removed deadline check to show all open tenders regardless of deadline
    const tenders = await Tender.find({
      status: 'open',
      // deadline: { $gt: now }, // Commenting out to show all open tenders
    });
    
    console.log(`Found ${tenders.length} open tenders`);
    return tenders;
  } catch (error) {
    console.error('Error finding open tenders:', error);
    return [];
  }
}