
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  FileText,
  Download,
  Upload,
  Check,
  FileUp,
  AlertCircle
} from 'lucide-react';

// Mock tender data
const tenderData = {
  id: 1,
  title: 'Office Equipment Procurement',
  description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
  category: 'IT',
  status: 'Open',
  deadline: '2025-05-30',
  budget: '$50,000',
  organization: 'Ministry of Education',
  publishDate: '2025-05-01',
  documents: [
    { id: 1, name: 'Tender Specification Document', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Equipment Requirements', type: 'docx', size: '1.8 MB' },
    { id: 3, name: 'Evaluation Criteria', type: 'pdf', size: '1.1 MB' }
  ],
  requiredDocuments: [
    'Technical Proposal',
    'Financial Proposal',
    'Company Profile',
    'Past Experience'
  ]
};

const ApplyTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<{[key: string]: File | null}>({});
  
  // Using mock data for now
  const tender = tenderData;
  
  // File input refs for each document type
  const fileInputRefs: {[key: string]: React.RefObject<HTMLInputElement>} = {};
  tender.requiredDocuments.forEach(doc => {
    fileInputRefs[doc] = React.useRef<HTMLInputElement>(null);
  });

  // Initialize files object
  React.useEffect(() => {
    const newFiles: {[key: string]: File | null} = {};
    tender.requiredDocuments.forEach(doc => {
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
      description: `${docType} has been removed from your submission.`,
    });
  };

  const onSubmit = () => {
    // Check if all required documents are uploaded
    const missingDocs = tender.requiredDocuments.filter(doc => !files[doc]);
    
    if (missingDocs.length > 0) {
      toast({
        title: "Missing documents",
        description: `Please upload: ${missingDocs.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would submit the files to your backend
    console.log('Files:', files);
    
    // Success message
    toast({
      title: "Submission successful!",
      description: "Your tender application has been submitted successfully.",
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
                <Link to={`/tenders/${id}`}>
                  Back to Tender Details
                </Link>
              </Button>
              <Badge>{tender.status}</Badge>
              <Badge variant="outline">{tender.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold">Apply for: {tender.title}</h1>
            <p className="text-muted-foreground mt-1">
              Upload all required documents to complete your submission
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Important</h4>
                        <p className="text-sm">All documents must be in PDF or Word format and less than 10MB in size.</p>
                      </div>
                    </div>
                  </div>
                
                  <h3 className="text-sm font-medium">Required Documents</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {tender.requiredDocuments.map((docType) => (
                      <div key={docType} className={`border rounded-md p-3 ${files[docType] ? 'border-green-200 bg-green-50' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">{docType}</span>
                          </div>
                          {files[docType] ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Check className="h-3 w-3 mr-1" /> Uploaded
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Required
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
                            {files[docType] ? 'Replace' : 'Upload'}
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
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tender Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{tender.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Deadline</h3>
                      <p className="mt-1">{new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                      <p className="mt-1">{tender.budget}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
                      <p className="mt-1">{tender.organization}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
                      <p className="mt-1">{new Date(tender.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Tender Documents</h3>
                    <div className="space-y-2">
                      {tender.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{doc.name} ({doc.size})</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
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

export default ApplyTender;
