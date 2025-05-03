import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, CheckCircle, ListOrdered, Award, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock submission data
const submissionData = {
  id: '123',
  tenderId: '45',
  tenderTitle: 'Office Equipment Procurement',
  vendorName: 'TechSolutions Inc.',
  submissionDate: '2025-04-15',
  status: 'Evaluated',
  documents: [
    { id: '1', name: 'Technical Proposal', type: 'pdf', size: '3.2 MB' },
    { id: '2', name: 'Financial Proposal', type: 'pdf', size: '1.8 MB' },
    { id: '3', name: 'Company Profile', type: 'pdf', size: '4.5 MB' },
    { id: '4', name: 'Past Experience', type: 'pdf', size: '2.3 MB' },
  ],
  evaluations: [
    { 
      evaluatorId: '101', 
      evaluatorName: 'John Smith',
      scores: {
        technical: 85,
        financial: 78,
        experience: 92,
        implementation: 88
      },
      comments: 'Strong technical proposal with excellent past experience.',
      overallScore: 85.75,
      rank: 2
    },
    { 
      evaluatorId: '102', 
      evaluatorName: 'Emma Wilson',
      scores: {
        technical: 82,
        financial: 81,
        experience: 90,
        implementation: 85
      },
      comments: 'Well-balanced proposal with good financial planning.',
      overallScore: 84.5,
      rank: 2
    },
    { 
      evaluatorId: '103', 
      evaluatorName: 'Michael Brown',
      scores: {
        technical: 88,
        financial: 75,
        experience: 95,
        implementation: 87
      },
      comments: 'Excellent experience and technical approach.',
      overallScore: 86.25,
      rank: 1
    }
  ],
  overallRank: 2,
  averageScore: 85.5
};

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isPublishingWinner, setIsPublishingWinner] = useState(false);
  
  // In a real app, you would fetch the submission data
  const submission = submissionData;
  
  const handlePublishWinner = () => {
    setIsPublishingWinner(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Winner Published",
        description: `${submission.vendorName} has been published as the winner of ${submission.tenderTitle}`,
      });
      setIsPublishingWinner(false);
    }, 1500);
  };
  
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  
  const backLinkDestination = isVendor 
    ? '/my-submissions' 
    : `/tenders/${submission.tenderId}/submissions`;
  
  const backLinkText = isVendor
    ? 'Back to My Submissions'
    : 'Back to Submissions List';
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={backLinkDestination}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {backLinkText}
                </Link>
              </Button>
              <Badge>{submission.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold">Submission Details</h1>
            <p className="text-muted-foreground">
              {submission.vendorName} for {submission.tenderTitle}
            </p>
          </div>
          
          {isAdmin && submission.status === 'Evaluated' && (
            <Button 
              variant="default"
              className="gap-2"
              onClick={handlePublishWinner}
              disabled={isPublishingWinner}
            >
              <Award className="h-4 w-4" />
              {isPublishingWinner ? 'Publishing...' : 'Publish as Winner'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Submission Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-medium">{submission.vendorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission Date</p>
                <p className="font-medium">{submission.submissionDate}</p>
              </div>
              {(isAdmin || user?.role === 'evaluator') && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="font-medium">{submission.averageScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Rank</p>
                    <p className="font-medium">#{submission.overallRank}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="documents">
              <TabsList className="mb-4">
                <TabsTrigger value="documents">Submission Documents</TabsTrigger>
                {(isAdmin || user?.role === 'evaluator') && (
                  <TabsTrigger value="evaluations">Evaluator Scores</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {submission.documents.map((doc) => (
                        <li key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-500" />
                            <span>{doc.name}</span>
                            <Badge variant="outline" className="ml-2">{doc.type.toUpperCase()}</Badge>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-3">{doc.size}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {(isAdmin || user?.role === 'evaluator') && (
                <TabsContent value="evaluations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluator Scores</CardTitle>
                      <CardDescription>Individual evaluator assessments and scoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Evaluator</TableHead>
                            <TableHead>Technical</TableHead>
                            <TableHead>Financial</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Implementation</TableHead>
                            <TableHead>Overall</TableHead>
                            <TableHead>Rank</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submission.evaluations.map((evaluation) => (
                            <TableRow key={evaluation.evaluatorId}>
                              <TableCell className="font-medium">{evaluation.evaluatorName}</TableCell>
                              <TableCell>{evaluation.scores.technical}</TableCell>
                              <TableCell>{evaluation.scores.financial}</TableCell>
                              <TableCell>{evaluation.scores.experience}</TableCell>
                              <TableCell>{evaluation.scores.implementation}</TableCell>
                              <TableCell className="font-medium">{evaluation.overallScore}</TableCell>
                              <TableCell>
                                <Badge variant={evaluation.rank === 1 ? "default" : "outline"} className="flex w-8 justify-center">
                                  {evaluation.rank === 1 ? (
                                    <div className="flex items-center">
                                      <ListOrdered className="h-3 w-3 mr-1" />
                                      {evaluation.rank}
                                    </div>
                                  ) : (
                                    `#${evaluation.rank}`
                                  )}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Evaluator Comments</h4>
                        <div className="space-y-3">
                          {submission.evaluations.map((evaluation) => (
                            <div key={evaluation.evaluatorId} className="p-3 bg-muted/50 rounded-md">
                              <p className="text-sm font-medium mb-1">{evaluation.evaluatorName}</p>
                              <p className="text-sm">{evaluation.comments}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubmissionDetail;
