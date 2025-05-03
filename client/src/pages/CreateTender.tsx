import React, { useState } from 'react';
import { format } from "date-fns";
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tenders/FileUploader';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BarChart2, 
  Calendar, 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  PlusCircle,
  Upload,
  File,
  HelpCircle,
  AlignLeft
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

// Tender categories for select dropdown
const tenderCategories = [
  { value: 'it', label: 'IT Services' },
  { value: 'construction', label: 'Construction' },
  { value: 'supplies', label: 'Office Supplies' },
  { value: 'consulting', label: 'Consulting Services' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'marketing', label: 'Marketing & Communication' },
  { value: 'training', label: 'Training & Development' },
  { value: 'other', label: 'Other' }  // Added "Other" category
];

// Evaluation criteria templates
const evaluationCriteriaTemplates = [
  { 
    id: 'technical',
    name: 'Technical Capability',
    weight: 40
  },
  { 
    id: 'financial',
    name: 'Financial Offer',
    weight: 30
  },
  { 
    id: 'experience',
    name: 'Experience',
    weight: 20
  },
  { 
    id: 'delivery',
    name: 'Delivery Timeline',
    weight: 10
  }
];

// Document templates
const documentTemplates = [
  {
    id: 'financial',
    name: 'Financial Proposal',
    type: 'Template'
  },
  {
    id: 'technical',
    name: 'Technical Requirements',
    type: 'Template'
  },
  {
    id: 'terms',
    name: 'Terms & Conditions',
    type: 'Template'
  }
];

// Sample evaluators
const evaluators = [
  {
    id: 'js',
    name: 'John Smith',
    email: 'john@example.com',
    department: 'IT'
  },
  {
    id: 'ew',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    department: 'Procurement'
  },
  {
    id: 'mb',
    name: 'Michael Brown',
    email: 'michael@example.com',
    department: 'Finance'
  },
  {
    id: 'as',
    name: 'Anna Smith',
    email: 'anna@example.com',
    department: 'Legal'
  }
];

// Form schema type
interface TenderFormValues {
  title: string;
  description: string;
  referenceId: string;
  category: string;
  customCategory?: string;
  budget: string;
  requirements: string;
  documents: File[];
  submissionDeadline: Date | undefined;
  announcementDate: Date | undefined;
  evaluationCriteria: Array<{
    name: string;
    weight: number;
  }>;
  selectedEvaluators: string[];
}

const CreateTender = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customCriteria, setCustomCriteria] = useState<{name: string, weight: number}[]>([]);
  const [usePresetCriteria, setUsePresetCriteria] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const totalSteps = 5;
  
  // Steps and their icons
  const steps = [
    { number: 1, title: 'Basic Information', icon: <AlignLeft className="h-5 w-5" /> },
    { number: 2, title: 'Documents', icon: <FileText className="h-5 w-5" /> },
    { number: 3, title: 'Evaluation Criteria', icon: <BarChart2 className="h-5 w-5" /> },
    { number: 4, title: 'Deadlines', icon: <Calendar className="h-5 w-5" /> },
    { number: 5, title: 'Evaluators', icon: <Users className="h-5 w-5" /> }
  ];

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TenderFormValues>({
    defaultValues: {
      title: '',
      description: '',
      referenceId: '',
      category: '',
      customCategory: '',
      budget: '',
      requirements: '',
      submissionDeadline: undefined,
      announcementDate: undefined,
      documents: [],
      evaluationCriteria: evaluationCriteriaTemplates,
      selectedEvaluators: []
    }
  });

  const selectedEvaluators = watch('selectedEvaluators') || [];
  const selectedCategory = watch('category');

  // Handle form submission
  const onSubmit = async (data: TenderFormValues) => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        setLoading(true);
        console.log('Form submitted:', data);
        
        // Format the data for the API
        const tenderPayload = {
          title: data.title,
          description: data.description,
          category: data.category === 'other' ? data.customCategory : data.category,
          budget: parseFloat(data.budget) || 0,
          deadline: data.submissionDeadline,
          status: 'draft',
          documents: data.documents.map(file => ({
            name: file.name,
            url: 'placeholder-url' // In a real app, you would upload files to a storage service
          })),
          evaluationCriteria: usePresetCriteria 
            ? data.evaluationCriteria 
            : customCriteria.filter(c => c.name.trim() !== ''),
          assignedEvaluators: data.selectedEvaluators
        };

        // Send data to the backend
        const response = await apiClient.post('/tenders', tenderPayload);
        
        console.log('API response:', response.data);
        
        // Show success toast
        toast({
          title: 'Success!',
          description: 'Tender has been created successfully.',
          variant: 'default',
        });
        
        // Redirect to the tenders list
        navigate('/tenders');
      } catch (error: any) {
        console.error('Error creating tender:', error);
        
        // Show error toast
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create tender. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setValue('documents', files);
  };

  // Navigate between steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add a custom evaluation criteria
  const addCustomCriteria = () => {
    setCustomCriteria([...customCriteria, { name: '', weight: 0 }]);
  };

  // Update custom criteria
  const updateCustomCriteria = (index: number, field: 'name' | 'weight', value: string | number) => {
    const updated = [...customCriteria];
    if (field === 'name') {
      updated[index].name = value as string;
    } else {
      updated[index].weight = value as number;
    }
    setCustomCriteria(updated);
  };

  // Toggle evaluator selection
  const toggleEvaluator = (evaluatorId: string) => {
    const current = [...selectedEvaluators];
    const index = current.indexOf(evaluatorId);
    
    if (index === -1) {
      current.push(evaluatorId);
    } else {
      current.splice(index, 1);
    }
    
    setValue('selectedEvaluators', current);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Tender</h1>
          <p className="text-muted-foreground mt-2">
            Follow the step-by-step process to create and publish a new tender.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 overflow-x-auto pb-4 sm:pb-0">
          {steps.map((s) => (
            <div 
              key={s.number} 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                ${currentStep === s.number ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
              `}
              onClick={() => { if (s.number <= currentStep) setCurrentStep(s.number); }}
            >
              <div className={currentStep >= s.number ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium' : 'bg-muted w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium'}>
                {s.number}
              </div>
              <div className="whitespace-nowrap">{s.title}</div>
              <div className={currentStep === s.number ? 'text-primary' : 'text-muted-foreground'}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                {steps[currentStep-1].icon}
              </div>
              <div>
                <CardTitle>{steps[currentStep-1].title}</CardTitle>
                <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tender Title</Label>
                      <Input 
                        id="title"
                        placeholder="e.g., IT Infrastructure Upgrade Project" 
                        {...register('title', { required: 'Title is required' })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a clear, descriptive title for this tender.
                      </p>
                      {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="referenceId">Reference ID</Label>
                        <Input 
                          id="referenceId"
                          placeholder="e.g., AADF-TECH-2023-01" 
                          {...register('referenceId')}
                        />
                        <p className="text-xs text-muted-foreground">
                          Unique reference number for this procurement.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          onValueChange={value => setValue('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {tenderCategories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select the category that best fits this procurement.
                        </p>
                      </div>
                    </div>

                    {/* Show custom category field if "other" is selected */}
                    {selectedCategory === 'other' && (
                      <div className="space-y-2">
                        <Label htmlFor="customCategory">Custom Category</Label>
                        <Input 
                          id="customCategory"
                          placeholder="Enter custom category name" 
                          {...register('customCategory', { required: 'Custom category is required when Other is selected' })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Please specify a category for this tender.
                        </p>
                        {errors.customCategory && (
                          <p className="text-sm text-destructive">{errors.customCategory.message}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        placeholder="Provide a detailed description of the tender requirements and objectives..." 
                        className="min-h-[150px]"
                        {...register('description', { required: 'Description is required' })}
                      />
                      <p className="text-xs text-muted-foreground">
                        This description will be visible to all vendors.
                      </p>
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Estimated Budget</Label>
                      <Input 
                        id="budget"
                        placeholder="e.g., $10,000 - $15,000" 
                        {...register('budget')}
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Provide an estimated budget range for this tender.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Documents */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Removed the first upload section as requested */}
                  <FileUploader 
                    onFileUpload={handleFileUpload}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
                    className="mb-6"
                  />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Document Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {documentTemplates.map((template) => (
                        <Card key={template.id} className="hover:bg-muted/50 cursor-pointer">
                          <CardContent className="p-4 flex items-center gap-3">
                            <File className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.type}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Evaluation Criteria */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Tabs defaultValue={usePresetCriteria ? "preset" : "custom"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preset" onClick={() => setUsePresetCriteria(true)}>Preset Criteria</TabsTrigger>
                      <TabsTrigger value="custom" onClick={() => setUsePresetCriteria(false)}>Custom Criteria</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preset" className="space-y-4 pt-4">
                      <p className="text-muted-foreground text-sm">
                        Select from predefined evaluation criteria templates based on procurement type.
                      </p>
                      
                      <div className="space-y-4">
                        {evaluationCriteriaTemplates.map((criteria) => (
                          <div key={criteria.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              <span>{criteria.name} ({criteria.weight}%)</span>
                            </div>
                            <Button variant="outline" size="sm">Edit Weight</Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="space-y-4 pt-4">
                      <p className="text-muted-foreground text-sm">
                        Create custom evaluation criteria specific to your procurement needs.
                      </p>
                      
                      <div className="space-y-3">
                        {customCriteria.map((criteria, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                            <div className="md:col-span-2">
                              <Input 
                                placeholder={`Criteria ${index + 1} name`} 
                                value={criteria.name}
                                onChange={(e) => updateCustomCriteria(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Input 
                                placeholder="Weight %" 
                                type="number" 
                                min="1" 
                                max="100"
                                value={criteria.weight || ''}
                                onChange={(e) => updateCustomCriteria(index, 'weight', parseInt(e.target.value))}
                              />
                              <span>%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="outline" type="button" className="w-full" onClick={addCustomCriteria}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Another Criteria
                      </Button>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Evaluation Criteria Tips:</p>
                      <p>Ensure your criteria are clear, measurable, and relevant to the tender requirements. The combined weight of all criteria should equal 100%.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Deadlines */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Submission Deadline</Label>
                      <DatePicker 
                        onSelect={(date) => setValue('submissionDeadline', date)}
                        selected={watch('submissionDeadline')}
                      />
                      <p className="text-xs text-muted-foreground">
                        Last date for vendors to submit their proposals.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Announcement Date</Label>
                      <DatePicker 
                        onSelect={(date) => setValue('announcementDate', date)}
                        selected={watch('announcementDate')}
                      />
                      <p className="text-xs text-muted-foreground">
                        Date when the winner will be announced.
                      </p>
                    </div>
                  </div>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Timeline Preview</h3>
                      <div className="relative">
                        {/* Modified to use a single line between timeline items */}
                        <div className="absolute h-full w-0.5 bg-primary/30 left-4 top-0 z-0"></div>
                        
                        <div className="relative pl-8 space-y-8">
                          <div className="relative">
                            <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                              1
                            </div>
                            <h4 className="font-medium">Publication</h4>
                            <p className="text-sm text-muted-foreground">Today</p>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                              2
                            </div>
                            <h4 className="font-medium">Q&A Period</h4>
                            <p className="text-sm text-muted-foreground">Date to be calculated</p>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                              3
                            </div>
                            <h4 className="font-medium">Submission Deadline</h4>
                            <p className="text-sm text-muted-foreground">
                              {watch('submissionDeadline') ? format(watch('submissionDeadline'), 'PPP') : 'Not set'}
                            </p>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                              4
                            </div>
                            <h4 className="font-medium">Evaluation Period</h4>
                            <p className="text-sm text-muted-foreground">Date to be calculated</p>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                              5
                            </div>
                            <h4 className="font-medium">Winner Announcement</h4>
                            <p className="text-sm text-muted-foreground">
                              {watch('announcementDate') ? format(watch('announcementDate'), 'PPP') : 'Not set'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 5: Evaluators */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Assign Evaluators</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select team members who will review and score vendor submissions.
                    </p>
                    
                    <div className="space-y-2">
                      {evaluators.map((evaluator) => (
                        <div 
                          key={evaluator.id} 
                          className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-accent/5 cursor-pointer"
                          onClick={() => toggleEvaluator(evaluator.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {evaluator.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{evaluator.name}</div>
                              <div className="text-xs text-muted-foreground">{evaluator.email} • {evaluator.department}</div>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="h-4 w-4"
                            checked={selectedEvaluators.includes(evaluator.id)}
                            onChange={() => toggleEvaluator(evaluator.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3 border border-dashed border-muted-foreground/25">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Evaluator Access:</p>
                      <p className="text-sm text-muted-foreground">
                        Assigned evaluators will receive an email notification with instructions on how to access and evaluate the tender submissions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                ) : (
                  <Button type="button" variant="outline" disabled={loading}>
                    Save Draft
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button type="submit" disabled={loading}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Tender'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateTender;
