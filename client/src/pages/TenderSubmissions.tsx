import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Award, 
  ArrowUpDown, 
  FileText, 
  Check,
  Medal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { tenderApi } from '@/lib/api-client';

// Function to get the rank display
const getRankDisplay = (rank: number) => {
  if (rank === 0) return null;
  
  switch (rank) {
    case 1:
      return <Medal className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-700" />;
    default:
      return <span className="font-semibold">#{rank}</span>;
  }
};

const TenderSubmissions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({
    key: 'rank', 
    direction: 'ascending'
  });
  const [publishingWinnerId, setPublishingWinnerId] = useState<string | null>(null);
  const [tender, setTender] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiScored, setAiScored] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tenderRes = await tenderApi.getTenderById(id!);
        setTender(tenderRes.data);
        const subsRes = await tenderApi.getTenderSubmissions(id!);
        setSubmissions(subsRes.data);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Sort function
  const sortedSubmissions = React.useMemo(() => {
    let sortableItems = [...submissions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Special handling for rank - put rank=0 (unranked) at the end
        if (sortConfig.key === 'rank') {
          if (a.rank === 0) return 1;
          if (b.rank === 0) return -1;
        }
        
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [submissions, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handlePublishWinner = (submissionId: string) => {
    setPublishingWinnerId(submissionId);
    
    // Simulate API call
    setTimeout(() => {
      const winnerSubmission = submissions.find(s => s._id === submissionId);
      if (winnerSubmission) {
        toast({
          title: "Winner Published",
          description: `${winnerSubmission.vendor.name} has been published as the winner of ${tender.title}`,
        });
        
        // Update local state to reflect winner
        setSubmissions(
          submissions.map(submission => ({
            ...submission,
            status: submission._id === submissionId ? 'Winner' : submission.status
          }))
        );
      }
      setPublishingWinnerId(null);
    }, 1500);
  };

  const handleAiEvaluate = async () => {
    if (!id) return;
    try {
      const res = await tenderApi.evaluateSubmissions(id);
      const aiSubs = res.data.submissions;
      // Merge aiScore into submissions
      setSubmissions((prev) => prev.map((sub) => {
        const match = aiSubs.find((item: any) => {
          const doc = item._doc || item;
          return doc._id === sub._id;
        });
        return match ? { ...sub, aiScore: match.aiScore } : sub;
      }));
      setAiScored(true);
    } catch (error) {
      console.error('Error evaluating submissions with AI:', error);
    }
  };

  if (!tender) {
    return <div className="flex justify-center items-center h-64">Loading tender...</div>;
  }
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading submissions...</div>;
  }

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
            </div>
            <h1 className="text-2xl font-bold">Submissions for {tender.title}</h1>
            <p className="text-muted-foreground">
              {submissions.length} submissions received
            </p>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleAiEvaluate} disabled={aiScored}>
            Evaluate Score from AI
          </Button>
        </div>

        {submissions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">All Submissions</CardTitle>
              <CardDescription>
                Review and compare submissions by different vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead onClick={() => requestSort('submissionDate')} className="cursor-pointer">
                      <div className="flex items-center">
                        Submission Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead onClick={() => requestSort('averageScore')} className="cursor-pointer">
                      <div className="flex items-center">
                        Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('aiScore.final_score')}>
                      <div className="flex items-center">
                        AI Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubmissions.map((submission) => (
                    <TableRow key={submission._id} className={submission.rank === 1 ? "bg-yellow-50" : ""}>
                      <TableCell className="text-center">
                        {getRankDisplay(submission.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                            {submission.vendor.logo}
                          </div>
                          <div className="font-medium">{submission.vendor.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.submissionDate
                          ? new Date(submission.submissionDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.status === 'Winner' ? 'default' : 'outline'}>
                          {submission.status === 'Winner' && <Award className="mr-1 h-3 w-3" />}
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user?.role === 'admin' && submission.evaluations ? (
                          <div className="space-y-1">
                            {submission.evaluations.map((ev: any) => (
                              <div key={ev.evaluatorId} className="text-sm">
                                <span className="font-medium">{ev.evaluatorName}:</span> {ev.overallScore.toFixed(2)}
                              </div>
                            ))}
                            <div className="font-semibold">Avg: {submission.averageScore.toFixed(2)}</div>
                          </div>
                        ) : submission.averageScore > 0 ? (
                          <span className="font-medium">{submission.averageScore}</span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {/* AI Score cell */}
                        {submission.aiScore && submission.aiScore.final_score != null ? (
                          <div className="space-y-1 text-sm">
                            <div className="font-medium">{Number(submission.aiScore.final_score).toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              {Object.entries(submission.aiScore.subscores as Record<string, number | null | undefined>).map(([crit, score], idx, arr) => (
                                <span key={crit}>
                                  {crit}: {score != null ? score : '-'}{idx < arr.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/submissions/${submission._id}`)}>
                            <FileText className="mr-1 h-4 w-4" />
                            Details
                          </Button>
                          
                          {user?.role === 'admin' && submission.rank === 1 && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePublishWinner(submission._id)}
                              disabled={!!publishingWinnerId}
                            >
                              <Award className="mr-1 h-4 w-4" />
                              {publishingWinnerId === submission._id ? 'Publishing...' : 'Publish Winner'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No submissions found for this tender.</div>
        )}
      </div>
    </MainLayout>
  );
};

export default TenderSubmissions;
