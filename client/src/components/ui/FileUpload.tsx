import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, FileText, Image, Archive } from "lucide-react";
import { apiClient } from '@/lib/api-client';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: string;
  label?: string;
}

export interface UploadedFile {
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

/**
 * FileUpload component for uploading files to AWS S3
 */
export default function FileUpload({ 
  onFilesUploaded, 
  maxFiles = 5, 
  accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-rar-compressed",
  label = "Upload Files" 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
        // Log file info for debugging
        console.log(`Preparing to upload: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      });

      // Set up a mock progress indicator (S3 doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      console.log('Sending upload request to server...');
      const response = await apiClient.post('/tenders/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('Server response:', response.data);
      if (response.data.files) {
        setUploadedFiles(response.data.files);
        onFilesUploaded(response.data.files);
        setFiles([]); // Clear the file input
      }
    } catch (err: any) {
      console.error('Upload error details:', err);
      setError(err.response?.data?.message || 'Failed to upload files');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Function to get the appropriate icon based on file type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (mimeType.includes('pdf')) return <FileText className="h-6 w-6" />;
    if (mimeType.includes('word') || mimeType.includes('doc')) return <FileText className="h-6 w-6" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileText className="h-6 w-6" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="flex-1"
          />
          <Button 
            onClick={uploadFiles} 
            disabled={files.length === 0 || uploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {label}
          </Button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {uploading && (
          <div className="space-y-1">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">Uploading files...</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-medium">Selected Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span className="text-sm truncate max-w-[200px]">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="border rounded-md p-3 space-y-2">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.fileType)}
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline truncate max-w-[250px]"
                  >
                    {file.fileName} ({(file.fileSize / 1024).toFixed(1)} KB)
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}