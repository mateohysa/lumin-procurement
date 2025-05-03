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
 * Create a new tender with validation
 */
export async function createTender(tenderData: Partial<ITender>): Promise<{ tender: ITender | null; error?: string }> {
  try {
    // Basic validation
    if (!tenderData.title) {
      return { tender: null, error: 'Title is required' };
    }
    if (!tenderData.description) {
      return { tender: null, error: 'Description is required' };
    }
    if (!tenderData.category) {
      return { tender: null, error: 'Category is required' };
    }
    if (!tenderData.budget || tenderData.budget <= 0) {
      return { tender: null, error: 'Valid budget amount is required' };
    }
    if (!tenderData.deadline) {
      return { tender: null, error: 'Deadline is required' };
    }
    
    // Ensure deadline is in the future
    const now = new Date();
    const deadlineDate = new Date(tenderData.deadline);
    if (deadlineDate <= now) {
      return { tender: null, error: 'Deadline must be in the future' };
    }
    
    // Set default values if not provided
    const tenderWithDefaults = {
      ...tenderData,
      status: tenderData.status || 'draft',
      disputeTimeFrame: tenderData.disputeTimeFrame || 7
    };
    
    const tender = new Tender(tenderWithDefaults);
    const savedTender = await tender.save();
    return { tender: savedTender };
  } catch (error) {
    console.error('Error creating tender:', error);
    return { 
      tender: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred while creating tender' 
    };
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
    const now = new Date();
    const tenders = await Tender.find({
      status: 'open',
      deadline: { $gt: now },
    });
    return tenders;
  } catch (error) {
    console.error('Error finding open tenders:', error);
    return [];
  }
}

/**
 * Find tenders that are ending soon (within the next N days)
 */
export async function findTendersEndingSoon(days: number = 7): Promise<ITender[]> {
  try {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + days);
    
    const tenders = await Tender.find({
      status: 'open',
      deadline: { $gt: now, $lt: endDate }
    }).sort({ deadline: 1 });
    
    return tenders;
  } catch (error) {
    console.error('Error finding tenders ending soon:', error);
    return [];
  }
}

/**
 * Find tenders created by a specific user
 */
export async function findTendersByUser(userId: string): Promise<ITender[]> {
  try {
    const tenders = await Tender.find({
      createdBy: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });
    
    return tenders;
  } catch (error) {
    console.error(`Error finding tenders for user ${userId}:`, error);
    return [];
  }
}

/**
 * Find tenders by category
 */
export async function findTendersByCategory(category: string): Promise<ITender[]> {
  try {
    const tenders = await Tender.find({
      category: category
    }).sort({ createdAt: -1 });
    
    return tenders;
  } catch (error) {
    console.error(`Error finding tenders for category ${category}:`, error);
    return [];
  }
}

/**
 * Count tenders by status
 * Returns an object with counts for each status
 */
export async function countTendersByStatus(): Promise<Record<string, number>> {
  try {
    const result = await Tender.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const counts: Record<string, number> = {};
    result.forEach(item => {
      counts[item._id] = item.count;
    });
    
    return counts;
  } catch (error) {
    console.error('Error counting tenders by status:', error);
    return {};
  }
}

/**
 * Get recent activity on tenders
 * Returns recently created or updated tenders
 */
export async function getRecentTenderActivity(limit: number = 10): Promise<ITender[]> {
  try {
    const tenders = await Tender.find({})
      .sort({ updatedAt: -1 })
      .limit(limit);
    
    return tenders;
  } catch (error) {
    console.error('Error getting recent tender activity:', error);
    return [];
  }
}