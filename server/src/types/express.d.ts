// Add custom properties to the Express.User interface
import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface User {
      role: 'ProcurementManager' | 'Vendor' | 'Evaluator';
      username: string;
      email?: string;
      name?: string;
      avatar?: string;
      _id: string;
    }
  }
}

export {};