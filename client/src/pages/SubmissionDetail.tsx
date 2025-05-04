import React, { useState, useEffect } from 'react';
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
import { submissionApi, tenderApi } from '@/lib/api-client';

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<any>(null);
  const [aiScore, setAiScore] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiLoaded, setAiLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Track publishing state for winner button
  const [isPublishingWinner, setIsPublishingWinner] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSubmission = async () => {
      setLoading(true);
      try {
        const res = await submissionApi.getSubmissionById(id);
        const data = res.data;
        // Map attachments to documents
        const documents = data.attachments.map((att: any) => ({
          id: att.fileKey,
          name: att.fileName,
          type: att.fileType.split('/')[1] || '',
          size: formatBytes(att.fileSize),
        }));
        // Use server-provided mock evaluations (scores and comments)
        const evaluations = data.evaluations || [];
        // Attach averageScore and overallRank from server if available
        const averageScore = data.averageScore;
        const overallRank = data.overallRank;
        // Update submission state with mock data
        setSubmission({ ...data, documents, evaluations, averageScore, overallRank });
      } catch (err: any) {
        console.error('Error fetching submission:', err);
        setError(err.message || 'Error fetching submission');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  // Handler to load AI evaluation on-demand
  const fetchAiEvaluation = async () => {
    if (!submission?.tender?._id) return;
    setAiLoading(true);
    try {
      const res = await tenderApi.evaluateSubmissions(submission.tender._id);
      const aiSubs = res.data.submissions || [];
      const aiEntry = aiSubs.find((item: any) => {
        const doc = item._doc || item;
        return doc._id === submission._id;
      });
      setAiScore(aiEntry?.aiScore || null);
      setAiLoaded(true);
    } catch (err) {
      console.error('Error fetching AI evaluation:', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading submission...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }
  if (!submission) {
    return <div className="flex justify-center items-center h-64">Submission not found.</div>;
  }

  const handlePublishWinner = () => {
    setIsPublishingWinner(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Winner Published",
        description: `${submission.vendor?.name} has been published as the winner of ${submission.tender?.title}`,
      });
      setIsPublishingWinner(false);
    }, 1500);
  };
  
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  
  console.log(submission);
  const backLinkDestination = isVendor 
    ? '/my-submissions' 
    : `/tenders/${submission.tender._id}/submissions`;
  
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
              {submission.vendor?.name} for {submission.tender?.title}
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
                <p className="font-medium">{submission.vendor?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission Date</p>
                <p className="font-medium">{new Date(submission.createdAt).toLocaleDateString()}</p>
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
                  <>
                    <TabsTrigger value="evaluations">Evaluator Scores</TabsTrigger>
                    <TabsTrigger value="ai">AI Evaluation</TabsTrigger>
                  </>
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
              {(isAdmin || user?.role === 'evaluator') && (
                <TabsContent value="ai">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {!aiLoaded ? (
                         <Button variant="outline" size="sm" onClick={fetchAiEvaluation} disabled={aiLoading}>
                           {aiLoading ? 'Evaluating...' : 'Load AI Evaluation'}
                         </Button>
                       ) : aiScore ? (
                         <div className="space-y-2">
                           <div className="font-medium">
                             Final Score: {aiScore.final_score != null ? Number(aiScore.final_score).toFixed(2) : '-'}
                           </div>
                           <ul className="list-disc list-inside ml-4 text-sm">
                             {Object.entries(aiScore.subscores as Record<string, number | null | undefined>).map(([crit, val]) => (
                               <li key={crit}>{crit}: {val != null ? val : '-'}</li>
                             ))}
                           </ul>
                         </div>
                       ) : (
                         <p className="text-muted-foreground">AI evaluation not available.</p>
                       )}
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
