import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set up multer for memory storage
const storage = multer.memoryStorage();

// File filter to check file types
const fileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  // Allowed file types
  const allowedFileTypes = [
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
    // Images
    '.jpg', '.jpeg', '.png', '.gif',
    // Archives
    '.zip', '.rar',
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type. Only documents, images, and archives are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

export default upload;