
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  className?: string;
}

export function FileUploader({
  onFileUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    // Check file count
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files`)
      return
    }
    
    // Check file sizes and types
    const invalidFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        return true
      }
      
      if (acceptedFileTypes.length > 0) {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
        return !acceptedFileTypes.includes(fileExtension)
      }
      
      return false
    })
    
    if (invalidFiles.length > 0) {
      setError(`Some files are too large or have invalid formats`)
      return
    }
    
    setError(null)
    const newFiles = [...files, ...selectedFiles]
    setFiles(newFiles)
    onFileUpload(newFiles)
    
    // Reset input value to allow selecting the same file again if removed
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onFileUpload(newFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      
      // Check file count
      if (droppedFiles.length + files.length > maxFiles) {
        setError(`You can upload a maximum of ${maxFiles} files`)
        return
      }
      
      // Filter valid files
      const validFiles = droppedFiles.filter(file => {
        if (file.size > maxSize) {
          return false
        }
        
        if (acceptedFileTypes.length > 0) {
          const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
          return acceptedFileTypes.includes(fileExtension)
        }
        
        return true
      })
      
      if (validFiles.length < droppedFiles.length) {
        setError(`Some files are too large or have invalid formats`)
      } else {
        setError(null)
      }
      
      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)
      onFileUpload(newFiles)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(',')}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            {acceptedFileTypes.join(', ')} (Max: {maxFiles} files, {maxSize / (1024 * 1024)}MB each)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded files:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
