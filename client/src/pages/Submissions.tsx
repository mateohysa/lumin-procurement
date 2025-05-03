
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { FileUp, AlertCircle, Send, Check, ChevronRight, ChevronLeft, Clock, FileCheck, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from "@/lib/utils";

// Define the form validation schema for step 1 (Vendor Identity)
const vendorIdentitySchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  contactName: z.string().min(2, { message: "Contact name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  registrationId: z.string().min(4, { message: "Registration ID is required." }),
  vatId: z.string().optional(),
});

// Define the form validation schema for step 2 (Tender Selection)
const tenderSelectionSchema = z.object({
  tenderId: z.string().min(1, { message: "Please select a tender." }),
});

// Define the form validation schema for step 3 (Final Submission)
const finalSubmissionSchema = z.object({
  notes: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must confirm that all information is accurate and legally valid.",
  }),
});

// Mock data for available tenders
const availableTenders = [
  { id: "T-2023-42", title: "IT Infrastructure Upgrade", deadline: "2025-05-15", priority: "High" },
  { id: "T-2023-41", title: "Office Furniture Procurement", deadline: "2025-06-01", priority: "Normal" },
  { id: "T-2023-40", title: "Consulting Services", deadline: "2025-05-20", priority: "Urgent" },
  { id: "T-2023-39", title: "Marketing Campaign", deadline: "2025-05-30", priority: "Normal" },
];

// Define required documents per tender type
const requiredDocuments = {
  "T-2023-42": ["Proposal Document", "Budget Sheet", "Timeline", "Team CVs"],
  "T-2023-41": ["Proposal Document", "Budget Sheet", "Product Catalog"],
  "T-2023-40": ["Proposal Document", "Budget Sheet", "Company Profile", "Team CVs"],
  "T-2023-39": ["Proposal Document", "Budget Sheet", "Portfolio", "Campaign Timeline"],
};

export default function Submissions() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [files, setFiles] = useState<{[key: string]: File | null}>({});
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>("");
  
  // Form for step 1 (Vendor Identity)
  const identityForm = useForm({
    resolver: zodResolver(vendorIdentitySchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      registrationId: "",
      vatId: "",
    },
  });

  // Form for step 2 (Tender Selection)
  const tenderForm = useForm({
    resolver: zodResolver(tenderSelectionSchema),
    defaultValues: {
      tenderId: "",
    },
  });

  // Form for step 3 (Final Submission)
  const finalForm = useForm({
    resolver: zodResolver(finalSubmissionSchema),
    defaultValues: {
      notes: "",
      termsAccepted: false,
    },
  });

  // Calculate remaining days for selected tender
  const selectedTenderId = tenderForm.watch("tenderId");
  const selectedTender = availableTenders.find(tender => tender.id === selectedTenderId);
  
  // Get required documents for selected tender
  const requiredDocsForTender = selectedTenderId ? requiredDocuments[selectedTenderId as keyof typeof requiredDocuments] || [] : [];

  // Initialize files object with required documents
  React.useEffect(() => {
    if (selectedTenderId && requiredDocsForTender.length > 0) {
      const newFiles: {[key: string]: File | null} = {};
      requiredDocsForTender.forEach(doc => {
        newFiles[doc] = files[doc] || null;
      });
      setFiles(newFiles);
    }
  }, [selectedTenderId, requiredDocsForTender]);

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // File input refs for each document type
  const fileInputRefs: {[key: string]: React.RefObject<HTMLInputElement>} = {};
  requiredDocsForTender.forEach(doc => {
    fileInputRefs[doc] = React.useRef<HTMLInputElement>(null);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type (PDF or Word only)
    const isValidType = selectedFile.type === 'application/pdf' || 
                      selectedFile.type === 'application/msword' || 
                      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // Validate file size (at least 20KB)
    const isValidSize = selectedFile.size >= 20 * 1024;
    
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
        title: "File too small",
        description: `${selectedFile.name} must be at least 20KB.`,
        variant: "destructive",
      });
      return;
    }
    
    // Rename file to follow convention: CompanyName_DocumentType.ext
    const companyName = identityForm.getValues("companyName");
    const fileExt = selectedFile.name.split('.').pop();
    const renamedFile = new File(
      [selectedFile], 
      `${companyName.replace(/\s+/g, '')}_${docType.replace(/\s+/g, '')}.${fileExt}`,
      { type: selectedFile.type }
    );
    
    setFiles(prev => ({ ...prev, [docType]: renamedFile }));
    
    toast({
      title: "File added",
      description: `${renamedFile.name} has been added to your submission.`,
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

  const nextStep = async () => {
    try {
      if (currentStep === 1) {
        await identityForm.trigger();
        if (identityForm.formState.isValid) {
          setCurrentStep(2);
        }
      } else if (currentStep === 2) {
        await tenderForm.trigger();
        
        if (tenderForm.formState.isValid) {
          // Check if all required files are uploaded
          const missingDocs = requiredDocsForTender.filter(doc => !files[doc]);
          
          if (missingDocs.length > 0) {
            toast({
              title: "Missing required documents",
              description: `Please upload the following documents: ${missingDocs.join(', ')}`,
              variant: "destructive",
            });
            return;
          }
          
          setCurrentStep(3);
        }
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const showPreview = async () => {
    await finalForm.trigger();
    if (finalForm.formState.isValid) {
      setPreviewDialogOpen(true);
    }
  };

  const handleSubmit = () => {
    // Generate a submission ID
    const newSubmissionId = `S-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionId(newSubmissionId);
    
    // Combine all form data
    const formData = {
      ...identityForm.getValues(),
      ...tenderForm.getValues(),
      ...finalForm.getValues(),
      files: Object.keys(files).map(key => ({
        name: files[key]?.name,
        type: files[key]?.type,
        size: files[key]?.size,
      })),
      submissionId: newSubmissionId,
      submissionDate: new Date().toISOString(),
    };
    
    // Here you would typically send the data to your backend
    console.log("Submission data:", formData);
    
    setSubmissionComplete(true);
    setPreviewDialogOpen(false);
    
    toast({
      title: "Submission successful",
      description: `Your proposal (ID: ${newSubmissionId}) has been submitted and will be visible after the deadline.`,
    });
  };

  const renderProgressIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep > step 
                    ? "bg-green-100 text-green-600 border-2 border-green-500" 
                    : currentStep === step 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-gray-100 text-gray-500 border border-gray-300"
                )}
              >
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              <span className={cn(
                "text-xs mt-1", 
                currentStep === step ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {step === 1 ? "Vendor Details" : step === 2 ? "Select Tender" : "Submit"}
              </span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute top-0 left-5 right-5 flex">
            <div className={cn("h-1 flex-1", currentStep > 1 ? "bg-primary" : "bg-gray-200")}></div>
            <div className={cn("h-1 flex-1", currentStep > 2 ? "bg-primary" : "bg-gray-200")}></div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form {...identityForm}>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={identityForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={identityForm.control}
                    name="registrationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={identityForm.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={identityForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={identityForm.control}
                  name="vatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT/Tax ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="VAT or Tax identification number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      
      case 2:
        return (
          <Form {...tenderForm}>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Tender & Documents</h3>
                
                <FormField
                  control={tenderForm.control}
                  name="tenderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Tender *</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          <option value="">Select a tender</option>
                          {availableTenders.map((tender) => (
                            <option key={tender.id} value={tender.id}>
                              {tender.id}: {tender.title} ({tender.priority})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                      {selectedTender && (
                        <div className="flex items-center mt-2 text-sm">
                          <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className="font-medium">
                            {calculateDaysRemaining(selectedTender.deadline)} days remaining until deadline
                          </span>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {selectedTenderId && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-4">Required Documents</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requiredDocsForTender.map((docType) => (
                        <Card key={docType} className={cn(
                          "overflow-hidden",
                          files[docType] ? "border-green-200" : "border-gray-200"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="font-medium">{docType}</span>
                                </div>
                                {files[docType] ? (
                                  <div className="flex items-center text-green-600">
                                    <FileCheck className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Uploaded</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-yellow-500">Required</div>
                                )}
                              </div>
                              
                              <input
                                ref={fileInputRefs[docType]}
                                type="file"
                                onChange={(e) => handleFileChange(e, docType)}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                              />
                              
                              {files[docType] ? (
                                <div className="text-sm truncate mt-1">{files[docType]?.name}</div>
                              ) : null}
                              
                              <div className="flex space-x-2 mt-2">
                                <Button 
                                  type="button" 
                                  variant={files[docType] ? "outline" : "default"}
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => triggerFileInput(docType)}
                                >
                                  {files[docType] ? "Replace File" : "Upload File"}
                                </Button>
                                
                                {files[docType] && (
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removeFile(docType)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-blue-800">
                          All documents should be in PDF or Word format (.doc, .docx).
                          Minimum file size is 20KB. Maximum file size is 10MB per file.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Form>
        );
      
      case 3:
        return (
          <Form {...finalForm}>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Finalize Submission</h3>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Selected Tender</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">ID:</span>
                        <span className="text-sm font-medium ml-2">{selectedTender?.id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Title:</span>
                        <span className="text-sm font-medium ml-2">{selectedTender?.title}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Priority:</span>
                        <span className="text-sm font-medium ml-2">{selectedTender?.priority}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Deadline:</span>
                        <span className="text-sm font-medium ml-2">{selectedTender?.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Uploaded Documents ({Object.values(files).filter(Boolean).length})</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <ul className="space-y-2">
                      {Object.keys(files).map((docType) => (
                        files[docType] && (
                          <li key={docType} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <FileCheck className="h-4 w-4 mr-2 text-green-600" />
                              <span>{docType}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {(files[docType]?.size && files[docType]!.size / 1024 > 1024) 
                                ? `${(files[docType]!.size / 1024 / 1024).toFixed(2)} MB` 
                                : `${(files[docType]!.size! / 1024).toFixed(2)} KB`}
                            </span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>

                <FormField
                  control={finalForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions or comments about your submission"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use this area to provide additional context for your proposal.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={finalForm.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 mt-1"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I confirm all information is accurate and legally valid
                        </FormLabel>
                        <FormDescription>
                          By checking this box, you confirm that all submitted information is truthful
                          and all documents are authentic and complete.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <div className="text-sm text-yellow-800">
                        Your submission will remain hidden until the tender deadline has passed.
                        Make sure all required documents are attached before submitting.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        );
      
      default:
        return null;
    }
  };

  const renderSuccessScreen = () => {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Submission Successful!</h2>
        <p className="text-center text-muted-foreground mb-6">
          Your proposal has been submitted and will be reviewed after the deadline.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md mb-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Submission ID:</span>
              <span className="text-sm font-bold ml-2">{submissionId}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium ml-2">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Company:</span>
              <span className="text-sm font-medium ml-2">{identityForm.getValues("companyName")}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tender:</span>
              <span className="text-sm font-medium ml-2">{selectedTender?.title}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Documents:</span>
              <span className="text-sm font-medium ml-2">{Object.values(files).filter(Boolean).length}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setSubmissionComplete(false);
              setCurrentStep(1);
              identityForm.reset();
              tenderForm.reset();
              finalForm.reset();
              setFiles({});
            }}
          >
            Submit Another Proposal
          </Button>
          <Button variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tender Submission</h1>
          <p className="text-muted-foreground mt-2">
            Submit your proposal for an open tender. All submissions are hidden until the deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Submission Form</CardTitle>
              </CardHeader>
              <CardContent>
                {!submissionComplete ? (
                  <>
                    {renderProgressIndicator()}
                    {renderStepContent()}
                    
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                      )}
                      
                      <div className="ml-auto flex gap-3">
                        {currentStep === 3 ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={showPreview}
                            >
                              Preview Submission
                            </Button>
                            <Button
                              type="button"
                              onClick={showPreview}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Submit Proposal
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            onClick={nextStep}
                          >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  renderSuccessScreen()
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Required Documents</h4>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>Company registration certificate</li>
                    <li>Formal proposal document (PDF)</li>
                    <li>Financial offer/budget</li>
                    <li>Implementation timeline</li>
                    <li>Team CVs (if applicable)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">File Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>PDF or Word formats only</li>
                    <li>File size: minimum 20KB, maximum 10MB per file</li>
                    <li>Clear file naming (e.g., "CompanyName_Budget.pdf")</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Deadline Information</h4>
                  <p className="mt-2 text-muted-foreground">
                    All submissions must be completed before the tender deadline.
                    Late submissions will not be accepted by the system.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Submission Process</h4>
                  <ol className="list-decimal list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>Enter your company details</li>
                    <li>Select a tender and upload required documents</li>
                    <li>Review and submit your proposal</li>
                    <li>Receive a confirmation with your submission ID</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Your Submission</DialogTitle>
            <DialogDescription>
              Please review your submission details before finalizing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Company Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Company Name:</div>
                <div>{identityForm.getValues("companyName")}</div>
                <div className="text-muted-foreground">Registration ID:</div>
                <div>{identityForm.getValues("registrationId")}</div>
                <div className="text-muted-foreground">Contact Person:</div>
                <div>{identityForm.getValues("contactName")}</div>
                <div className="text-muted-foreground">Email:</div>
                <div>{identityForm.getValues("email")}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tender Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Tender ID:</div>
                <div>{selectedTender?.id}</div>
                <div className="text-muted-foreground">Title:</div>
                <div>{selectedTender?.title}</div>
                <div className="text-muted-foreground">Deadline:</div>
                <div>{selectedTender?.deadline}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Documents ({Object.values(files).filter(Boolean).length})</h4>
              <ul className="space-y-1 text-sm">
                {Object.keys(files).map((docType) => (
                  files[docType] && (
                    <li key={docType} className="flex justify-between">
                      <span>{docType}:</span>
                      <span className="text-muted-foreground">{files[docType]?.name}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
            
            {finalForm.getValues("notes") && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Additional Notes</h4>
                <p className="text-sm text-muted-foreground">{finalForm.getValues("notes")}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Edit Submission
            </Button>
            <Button onClick={handleSubmit}>
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
