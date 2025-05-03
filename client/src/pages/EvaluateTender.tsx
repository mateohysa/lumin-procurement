
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

// Mock data
const mockTender = {
  id: 'T-2023-007',
  title: 'IT Infrastructure Upgrade',
  description: 'Seeking proposals for a comprehensive upgrade of our IT infrastructure including servers, network equipment, and workstations.',
  company: 'TechSolutions Inc.',
  submissionDate: '2025-04-20',
  criteria: [
    { id: 1, name: 'Technical Merit', weight: 30 },
    { id: 2, name: 'Price', weight: 25 },
    { id: 3, name: 'Experience & Qualifications', weight: 20 },
    { id: 4, name: 'Delivery Timeline', weight: 15 },
    { id: 5, name: 'Support & Maintenance', weight: 10 },
  ],
  documents: [
    { id: 1, name: 'Technical Proposal.pdf', size: '2.4 MB' },
    { id: 2, name: 'Company Profile.pdf', size: '1.8 MB' },
    { id: 3, name: 'Financial Offer.pdf', size: '1.2 MB' },
    { id: 4, name: 'Implementation Plan.xlsx', size: '890 KB' },
  ]
};

// Form schema type for the evaluation
interface EvaluationFormValues {
  comments: string;
  [key: string]: any;
}

const EvaluateTender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('criteria'); // 'criteria' or 'documents'
  
  const form = useForm<EvaluationFormValues>({
    defaultValues: {
      comments: '',
    }
  });
  
  const { register, handleSubmit, setValue, watch } = form;

  // Calculate the total score based on form values
  const calculateTotalScore = () => {
    let total = 0;
    mockTender.criteria.forEach(criterion => {
      const scoreKey = `score_${criterion.id}`;
      const score = parseInt(watch(scoreKey) || '0');
      total += score;
    });
    return total;
  };

  // Submit the evaluation
  const onSubmit = (data: EvaluationFormValues) => {
    const totalScore = calculateTotalScore();
    
    // Prepare the submission data with scores and comments
    const evaluationData = {
      tenderId: id,
      totalScore,
      criteriaScores: mockTender.criteria.map(criterion => ({
        criterionId: criterion.id,
        score: parseInt(data[`score_${criterion.id}`] || '0'),
      })),
      comments: data.comments,
    };
    
    console.log('Evaluation submitted:', evaluationData);
    
    toast({
      title: 'Evaluation Submitted',
      description: `You've successfully submitted your evaluation with a score of ${totalScore} out of 100.`,
    });
    
    // Redirect to the evaluations list
    navigate('/my-evaluations');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Evaluate Submission</h1>
          <p className="text-muted-foreground">
            Review and score the vendor's submission for Tender #{mockTender.id}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tender ID</h3>
                  <p>{mockTender.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tender Title</h3>
                  <p>{mockTender.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                  <p>{mockTender.company}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted On</h3>
                  <p>{mockTender.submissionDate}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeSection === 'criteria' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('criteria')}
                >
                  Evaluation Criteria
                </Button>
                <Button 
                  variant={activeSection === 'documents' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('documents')}
                >
                  Submitted Documents
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Score</span>
                    <span className="font-medium">{calculateTotalScore()}/100</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${calculateTotalScore()}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Evaluation Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {activeSection === 'criteria' ? 'Evaluation Criteria' : 'Submitted Documents'}
                </CardTitle>
                <CardDescription>
                  {activeSection === 'criteria' 
                    ? 'Score each criterion from 0-20 based on the vendor\'s submission' 
                    : 'Review the documents submitted by the vendor'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {activeSection === 'criteria' ? (
                    <div className="space-y-6">
                      {mockTender.criteria.map((criterion) => (
                        <div key={criterion.id} className="space-y-3 pb-4 border-b">
                          <div className="flex justify-between items-center">
                            <Label htmlFor={`score_${criterion.id}`} className="text-base font-medium">
                              {criterion.name}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              Weight: {criterion.weight}%
                            </span>
                          </div>
                          
                          <RadioGroup
                            defaultValue="0"
                            onValueChange={(value) => 
                              setValue(`score_${criterion.id}`, value)
                            }
                          >
                            <div className="flex flex-wrap gap-4">
                              {[0, 5, 10, 15, 20].map(score => (
                                <div key={score} className="flex items-center gap-1">
                                  <RadioGroupItem 
                                    value={score.toString()} 
                                    id={`${criterion.id}_${score}`} 
                                  />
                                  <Label htmlFor={`${criterion.id}_${score}`}>{score}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      ))}
                      
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="comments" className="text-base font-medium">
                          Additional Comments
                        </Label>
                        <Textarea
                          id="comments"
                          placeholder="Enter any additional comments or feedback about the submission..."
                          className="min-h-[150px]"
                          {...register('comments')}
                        />
                      </div>
                      
                      <div className="flex justify-between pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Submit Evaluation
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ScrollArea className="h-[450px]">
                        <div className="space-y-4">
                          {mockTender.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="flex justify-center pt-4">
                        <Button 
                          onClick={() => setActiveSection('criteria')} 
                          className="w-full max-w-xs"
                        >
                          Continue to Evaluation
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EvaluateTender;
