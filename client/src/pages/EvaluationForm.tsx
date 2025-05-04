import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  FileText, 
  Download, 
  Check, 
  Clock,
  Building
} from 'lucide-react';

// Mock evaluation data
const evaluationData = {
  id: "E-101",
  submissionId: "S-202",
  tenderId: "T-2023-41",
  tenderTitle: "Office Furniture Procurement",
  vendorName: "Furniture Solutions Inc.",
  submissionDate: "2025-05-10",
  status: "pending",
  documents: [
    { id: 1, name: "Technical Proposal", type: "pdf", size: "3.2 MB" },
    { id: 2, name: "Financial Proposal", type: "pdf", size: "1.5 MB" },
    { id: 3, name: "Company Profile", type: "docx", size: "4.1 MB" },
    { id: 4, name: "Past Experience", type: "pdf", size: "2.8 MB" }
  ],
  criteria: [
    { id: 1, name: "Technical Capability", weight: 30, description: "Quality and completeness of technical proposal" },
    { id: 2, name: "Financial Proposal", weight: 25, description: "Cost effectiveness and budget details" },
    { id: 3, name: "Experience", weight: 20, description: "Past experience with similar projects" },
    { id: 4, name: "Delivery Timeline", weight: 15, description: "Feasibility of proposed timeline" },
    { id: 5, name: "Sustainability", weight: 10, description: "Environmental considerations and sustainability" }
  ]
};

const EvaluationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Load and group pending evaluations for this tender
  const pendingList = JSON.parse(localStorage.getItem('pendingEvaluations') || '[]');
  const tenderSubmissions = pendingList.filter((e: any) => e.tender.id === evaluationData.tenderId);
  // Track which vendor tab is active
  const initialVendorIndex = tenderSubmissions.findIndex((e: any) => e.id === id);
  const [vendorIndex, setVendorIndex] = useState(initialVendorIndex >= 0 ? initialVendorIndex : 0);
  // Per-vendor scores, comments, and overall comment
  const [perVendorData, setPerVendorData] = useState(
    tenderSubmissions.map(() => ({ scores: {}, comments: {}, overall: '' }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Helper to update current vendor data
  const updateVendorData = (field: 'scores' | 'comments' | 'overall', key: any, value?: any) => {
    setPerVendorData(prev => {
      const updated = [...prev];
      const cur = { ...updated[vendorIndex] } as any;
      if (field === 'overall') cur.overall = key;
      else if (field === 'scores') cur.scores[key] = value;
      else cur.comments[key] = value;
      updated[vendorIndex] = cur;
      return updated;
    });
  };
  // Use global evaluationData for criteria and documents
  const evaluation = evaluationData;
  
  const handleScoreChange = (criteriaId: number, score: number) => {
    if (score < 1 || score > 5) return;
    updateVendorData('scores', criteriaId, score);
  };
  
  const handleCommentChange = (criteriaId: number, comment: string) => {
    updateVendorData('comments', criteriaId, comment);
  };
  
  const getTotalScore = (idx: number) => {
    const { scores } = perVendorData[idx];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    evaluationData.criteria.forEach(criterion => {
      const sc = scores[criterion.id];
      if (sc) {
        totalWeightedScore += sc * criterion.weight;
        totalWeight += criterion.weight;
      }
    });
    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : "N/A";
  };
  
  const isVendorComplete = (idx: number) => {
    const { scores, overall } = perVendorData[idx];
    return evaluationData.criteria.every(c => scores[c.id]) && overall.trim().length > 0;
  };
  // Only allow submit when all vendors evaluated
  const allComplete = tenderSubmissions.length > 0 && tenderSubmissions.every((_, idx) => isVendorComplete(idx));
  
  const handleSubmit = () => {
    if (!allComplete) {
      toast({ title: "Incomplete evaluations", description: "Please evaluate all vendors before submitting.", variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, you would submit the evaluation to your backend
    setTimeout(() => {
      toast({
        title: "Evaluations submitted",
        description: "All vendor evaluations have been submitted successfully",
      });
      
      // Update localStorage: remove from pending and add to completed
      const pending = JSON.parse(localStorage.getItem('pendingEvaluations') || '[]');
      const remaining = pending.filter((e: any) => e.tender.id !== evaluationData.tenderId);
      localStorage.setItem('pendingEvaluations', JSON.stringify(remaining));
      const completed = JSON.parse(localStorage.getItem('completedEvaluations') || '[]');
      const results = tenderSubmissions.map((sub, idx) => ({
        id: sub.id,
        tender: { id: evaluationData.tenderId, title: evaluationData.tenderTitle },
        vendor: `Vendor ${idx + 1}`,
        completedDate: new Date().toLocaleDateString(),
        score: parseFloat(getTotalScore(idx)),
        status: 'completed'
      }));
      localStorage.setItem('completedEvaluations', JSON.stringify([...completed, ...results]));
      
      setIsSubmitting(false);
      navigate('/my-evaluations');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        {/* Vendor tabs */}
        <div className="flex gap-2 mb-4">
          {tenderSubmissions.map((_, i) => (
            <Button key={i} size="sm" variant={vendorIndex === i ? 'default' : 'outline'} onClick={() => setVendorIndex(i)}>
              Vendor {i + 1}
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-evaluations">
                  Back to My Evaluations
                </Link>
              </Button>
              <Badge>{evaluation.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold">Evaluate Submission: {evaluation.tenderTitle}</h1>
            <p className="text-muted-foreground mt-1">
              Vendor: Vendor {vendorIndex + 1}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
                <CardDescription>
                  Rate each criterion on a scale of 1-5, with 5 being excellent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {evaluationData.criteria.map((criterion) => (
                    <div key={criterion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{criterion.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {criterion.weight}%</Badge>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Score (1-5):</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <Button
                                key={score}
                                size="sm"
                                variant={perVendorData[vendorIndex].scores[criterion.id] === score ? "default" : "outline"}
                                className="w-10 h-10"
                                onClick={() => handleScoreChange(criterion.id, score)}
                              >
                                {score}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <Textarea 
                          placeholder="Add comments about this criterion (optional)"
                          value={perVendorData[vendorIndex].comments[criterion.id] || ''}
                          onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Overall Comments</h3>
                    <Textarea 
                      placeholder="Provide overall feedback and observations about this submission"
                      value={perVendorData[vendorIndex].overall}
                      onChange={(e) => updateVendorData('overall', e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Total Weighted Score:</span>
                      <span className="ml-2 text-xl font-bold">{getTotalScore(vendorIndex)}/5.00</span>
                    </div>
                    
                    <Button 
                      onClick={handleSubmit}
                      size="lg"
                      disabled={!allComplete || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Evaluations'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Vendor:</span>
                    <span className="text-sm">{evaluation.vendorName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Submitted on:</span>
                    <span className="text-sm">
                      {new Date(evaluation.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Submission Documents</h3>
                    <div className="space-y-2">
                      {evaluation.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Tips for evaluating</h4>
                        <ul className="text-xs text-amber-700 mt-1 list-disc list-inside space-y-1">
                          <li>Review all documents thoroughly</li>
                          <li>Be objective and fair in your assessment</li>
                          <li>Provide specific feedback in comments</li>
                          <li>Consider both strengths and weaknesses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Score 1: Poor</h3>
                    <p className="text-muted-foreground">Does not meet requirements, significant deficiencies</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Score 2: Fair</h3>
                    <p className="text-muted-foreground">Partially meets requirements, notable deficiencies</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Score 3: Good</h3>
                    <p className="text-muted-foreground">Meets requirements with minor deficiencies</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Score 4: Very Good</h3>
                    <p className="text-muted-foreground">Exceeds requirements in some areas</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Score 5: Excellent</h3>
                    <p className="text-muted-foreground">Significantly exceeds all requirements</p>
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

export default EvaluationForm;
