
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, FileText, Download, Upload, Check, FileUp } from 'lucide-react';

// Mock submission data
const submissionData = {
  id: "S-101",
  tenderId: "T-2023-42",
  tenderTitle: "IT Infrastructure Upgrade",
  category: "IT",
  status: "Under Review",
  submissionDate: "2025-05-01",
  documents: [
    { id: 1, name: "Technical Proposal", type: "pdf", filename: "tech_proposal_v1.pdf", size: "3.2 MB" },
    { id: 2, name: "Financial Proposal", type: "pdf", filename: "financial_offer.pdf", size: "1.8 MB" },
    { id: 3, name: "Company Profile", type: "docx", filename: "company_profile_2025.docx", size: "4.1 MB" },
    { id: 4, name: "Past Experience", type: "pdf", filename: "past_projects.pdf", size: "2.8 MB" }
  ],
  requiredDocuments: [
    'Technical Proposal',
    'Financial Proposal',
    'Company Profile',
    'Past Experience'
  ]
};

const UpdateSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<{[key: string]: File | null}>({});
  const [existingFiles, setExistingFiles] = useState<{[key: string]: {name: string, size: string}}>({});
  
  // Using mock data for now
  const submission = submissionData;
  
  // File input refs for each document type
  const fileInputRefs: {[key: string]: React.RefObject<HTMLInputElement>} = {};
  submission.requiredDocuments.forEach(doc => {
    fileInputRefs[doc] = React.useRef<HTMLInputElement>(null);
  });

  // Initialize existing files
  useEffect(() => {
    const initialExistingFiles: {[key: string]: {name: string, size: string}} = {};
    submission.documents.forEach(doc => {
      initialExistingFiles[doc.name] = { name: doc.filename, size: doc.size };
    });
    setExistingFiles(initialExistingFiles);
    
    // Initialize files object
    const newFiles: {[key: string]: File | null} = {};
    submission.requiredDocuments.forEach(doc => {
      newFiles[doc] = null;
    });
    setFiles(newFiles);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type (PDF or Word only)
    const isValidType = selectedFile.type === 'application/pdf' || 
                      selectedFile.type === 'application/msword' || 
                      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // Validate file size (max 10MB)
    const isValidSize = selectedFile.size <= 10 * 1024 * 1024;
    
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `${selectedFile.name} must be a PDF or Word document.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidSize) {
      toast({
        title: "File too large",
        description: `${selectedFile.name} must be less than 10MB.`,
        variant: "destructive",
      });
      return;
    }
    
    setFiles(prev => ({ ...prev, [docType]: selectedFile }));
    
    toast({
      title: "File added",
      description: `${selectedFile.name} has been added to your submission.`,
    });
  };

  const triggerFileInput = (docType: string) => {
    fileInputRefs[docType]?.current?.click();
  };

  const removeFile = (docType: string) => {
    setFiles(prev => ({ ...prev, [docType]: null }));
    
    toast({
      title: "File removed",
      description: `New file for ${docType} has been removed.`,
    });
  };

  const onSubmit = () => {
    // Check if any files have been selected for update
    const hasUpdates = Object.values(files).some(file => file !== null);
    
    if (!hasUpdates) {
      toast({
        title: "No changes detected",
        description: "Please select at least one file to update.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would submit the updated files to your backend
    console.log('Files to update:', files);
    
    // Success message
    toast({
      title: "Submission updated",
      description: "Your tender submission has been updated successfully.",
    });
    
    // Redirect to my submissions page
    setTimeout(() => {
      navigate('/my-submissions');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-submissions">
                  Back to My Submissions
                </Link>
              </Button>
              <Badge>{submission.status}</Badge>
              <Badge variant="outline">{submission.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold">Update Submission: {submission.tenderTitle}</h1>
            <p className="text-muted-foreground mt-1">
              Update your submission documents if needed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Update Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Important</h4>
                        <p className="text-sm">
                          Only upload documents you wish to update. Your existing documents will remain unchanged unless you upload a replacement.
                        </p>
                      </div>
                    </div>
                  </div>
                
                  <h3 className="text-sm font-medium">Submission Documents</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {submission.requiredDocuments.map((docType) => (
                      <div key={docType} className={`border rounded-md p-3 ${files[docType] ? 'border-green-200 bg-green-50' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">{docType}</span>
                          </div>
                          {existingFiles[docType] && !files[docType] && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Current
                            </Badge>
                          )}
                          {files[docType] && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Check className="h-3 w-3 mr-1" /> New
                            </Badge>
                          )}
                        </div>
                        
                        <input
                          type="file"
                          ref={fileInputRefs[docType]}
                          className="hidden"
                          onChange={(e) => handleFileChange(e, docType)}
                          accept=".pdf,.doc,.docx"
                        />
                        
                        {existingFiles[docType] && !files[docType] && (
                          <div className="text-xs mb-2">
                            Current: {existingFiles[docType].name} ({existingFiles[docType].size})
                          </div>
                        )}
                        
                        {files[docType] && (
                          <div className="text-xs truncate mb-2">{files[docType]?.name}</div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant={files[docType] ? "outline" : "default"} 
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => triggerFileInput(docType)}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            {existingFiles[docType] ? 'Replace' : 'Upload'}
                          </Button>
                          
                          {files[docType] && (
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              className="text-xs"
                              onClick={() => removeFile(docType)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={onSubmit} 
                    size="lg"
                    className="px-8"
                  >
                    Update Submission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Submission Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tender</h3>
                    <p className="mt-1">{submission.tenderTitle}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submission ID</h3>
                      <p className="mt-1">{submission.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="mt-1">{submission.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                      <p className="mt-1">{submission.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submitted</h3>
                      <p className="mt-1">{new Date(submission.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-800">
                    <h3 className="text-sm font-medium">Important Notes</h3>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                      <li>You can update your submission until the tender deadline</li>
                      <li>Only upload files you want to replace</li>
                      <li>Make sure new documents follow all tender requirements</li>
                      <li>Previous versions will be available in submission history</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UpdateSubmission;
