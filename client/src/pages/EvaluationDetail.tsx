
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Star, 
  Building, 
  Clock,
  BarChart3,
  Printer,
  FileDown
} from 'lucide-react';

// Mock evaluation result data
const evaluationResultData = {
  id: "E-101",
  submissionId: "S-202",
  tenderId: "T-2023-41",
  tenderTitle: "Office Furniture Procurement",
  vendorName: "Furniture Solutions Inc.",
  submissionDate: "2025-05-10",
  evaluationDate: "2025-05-15",
  status: "completed",
  weightedScore: 4.25,
  overallComment: "Furniture Solutions Inc. submitted a comprehensive proposal that meets most of our requirements. Their technical capabilities are excellent and past experience is relevant. The financial proposal is competitive but slightly higher than expected. The proposed delivery timeline is feasible and their sustainability plan is adequate.",
  criteriaScores: [
    { id: 1, name: "Technical Capability", weight: 30, score: 4.5, comment: "Strong technical proposal with detailed specifications and implementation plan." },
    { id: 2, name: "Financial Proposal", weight: 25, score: 3.8, comment: "Slightly higher than budget but offers good value for money." },
    { id: 3, name: "Experience", weight: 20, score: 4.7, comment: "Excellent track record with similar projects in the education sector." },
    { id: 4, name: "Delivery Timeline", weight: 15, score: 4.0, comment: "Realistic timeline with clear milestones." },
    { id: 5, name: "Sustainability", weight: 10, score: 3.6, comment: "Adequate sustainability measures but could be more comprehensive." }
  ],
  documents: [
    { id: 1, name: "Technical Proposal", type: "pdf", size: "3.2 MB" },
    { id: 2, name: "Financial Proposal", type: "pdf", size: "1.5 MB" },
    { id: 3, name: "Company Profile", type: "docx", size: "4.1 MB" },
    { id: 4, name: "Past Experience", type: "pdf", size: "2.8 MB" }
  ],
  evaluators: [
    { id: 1, name: "Emma Wilson", role: "Procurement Officer", avatar: "EW" },
    { id: 2, name: "Michael Brown", role: "Technical Expert", avatar: "MB" }
  ]
};

const EvaluationDetail = () => {
  const { id } = useParams();
  
  // Use mock data for now
  const evaluation = evaluationResultData;
  
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 4.0) return "bg-green-400";
    if (score >= 3.5) return "bg-green-300";
    if (score >= 3.0) return "bg-yellow-400";
    if (score >= 2.0) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <span className="relative">
            <Star className="h-4 w-4 text-muted" />
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 absolute top-0 left-0 w-1/2 overflow-hidden" />
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted" />
        ))}
        <span className="ml-2 text-sm font-medium">{score.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/completed-evaluations">
                  Back to Completed Evaluations
                </Link>
              </Button>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <h1 className="text-2xl font-bold">Evaluation Results: {evaluation.tenderTitle}</h1>
            <p className="text-muted-foreground mt-1">
              Vendor: {evaluation.vendorName} | Evaluation ID: {evaluation.id}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Evaluation
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-48 h-48 rounded-full bg-slate-100 border-8 border-slate-200 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{evaluation.weightedScore.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">out of 5.00</span>
                      <div className="mt-2">{renderStars(evaluation.weightedScore)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overall Comments</h3>
                    <p className="text-muted-foreground">{evaluation.overallComment}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Criteria Scores</h3>
                    <div className="space-y-4">
                      {evaluation.criteriaScores.map((criterion) => (
                        <div key={criterion.id}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{criterion.name}</span>
                              <Badge variant="outline">Weight: {criterion.weight}%</Badge>
                            </div>
                            <div className="flex items-center">
                              {renderStars(criterion.score)}
                            </div>
                          </div>
                          <Progress 
                            value={criterion.score * 20} 
                            className={`h-2 ${getScoreColor(criterion.score)}`} 
                          />
                          <p className="text-sm text-muted-foreground mt-1 ml-1">{criterion.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documents Evaluated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {evaluation.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Vendor</div>
                    <div className="font-medium">{evaluation.vendorName}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Submission Date</div>
                      <div className="font-medium">
                        {new Date(evaluation.submissionDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Evaluation Date</div>
                      <div className="font-medium">
                        {new Date(evaluation.evaluationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Evaluators</div>
                    <div className="space-y-3">
                      {evaluation.evaluators.map((evaluator) => (
                        <div key={evaluator.id} className="flex items-center gap-3 p-2 bg-muted rounded-md">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
                            {evaluator.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{evaluator.name}</div>
                            <div className="text-xs text-muted-foreground">{evaluator.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evaluation.criteriaScores.map((criterion) => (
                    <div key={criterion.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{criterion.name}</span>
                        <span className="text-sm font-medium">{criterion.score.toFixed(1)}/5</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${getScoreColor(criterion.score)}`}
                            style={{ width: `${criterion.score * 20}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Weighted Score</span>
                    <span className="text-lg font-bold">{evaluation.weightedScore.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${getScoreColor(evaluation.weightedScore)}`}
                        style={{ width: `${evaluation.weightedScore * 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EvaluationDetail;
