
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Award,
  CheckCircle2,
  Star,
  InfoIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// Mock tender evaluation results data
const tenderResults = [
  {
    id: 1,
    title: 'Office Equipment Procurement',
    status: 'Pending Decision',
    evaluators: 3,
    evaluationsCompleted: 3,
    submissions: [
      { 
        id: 101, 
        vendorName: 'Tech Solutions Inc.', 
        score: 87, 
        rank: 1,
        evaluations: [
          { evaluator: 'John Evaluator', score: 85 },
          { evaluator: 'Sarah Reviewer', score: 90 },
          { evaluator: 'Mike Assessor', score: 86 }
        ]
      },
      { 
        id: 102, 
        vendorName: 'Office Depot', 
        score: 82, 
        rank: 2,
        evaluations: [
          { evaluator: 'John Evaluator', score: 80 },
          { evaluator: 'Sarah Reviewer', score: 85 },
          { evaluator: 'Mike Assessor', score: 81 }
        ]
      },
      { 
        id: 103, 
        vendorName: 'Business Suppliers Ltd', 
        score: 76, 
        rank: 3,
        evaluations: [
          { evaluator: 'John Evaluator', score: 75 },
          { evaluator: 'Sarah Reviewer', score: 79 },
          { evaluator: 'Mike Assessor', score: 74 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Building Renovation',
    status: 'Winner Selected',
    evaluators: 3,
    evaluationsCompleted: 3,
    winner: 'Superior Construction Co.',
    submissions: [
      { 
        id: 201, 
        vendorName: 'Superior Construction Co.', 
        score: 92, 
        rank: 1,
        evaluations: [
          { evaluator: 'John Evaluator', score: 91 },
          { evaluator: 'Sarah Reviewer', score: 94 },
          { evaluator: 'Mike Assessor', score: 91 }
        ]
      },
      { 
        id: 202, 
        vendorName: 'BuildRight Contractors', 
        score: 84, 
        rank: 2,
        evaluations: [
          { evaluator: 'John Evaluator', score: 82 },
          { evaluator: 'Sarah Reviewer', score: 89 },
          { evaluator: 'Mike Assessor', score: 81 }
        ]
      }
    ]
  }
];

const Results = () => {
  const [results, setResults] = useState(tenderResults);
  const [selectingWinner, setSelectingWinner] = useState<{ tenderId: number | null, submissionId: number | null }>({
    tenderId: null,
    submissionId: null
  });
  
  const handleSelectWinner = (tenderId: number, submissionId: number) => {
    setSelectingWinner({ tenderId, submissionId });
  };
  
  const confirmWinner = () => {
    if (selectingWinner.tenderId && selectingWinner.submissionId) {
      setResults(prevResults => 
        prevResults.map(tender => {
          if (tender.id === selectingWinner.tenderId) {
            const winningSubmission = tender.submissions.find(
              sub => sub.id === selectingWinner.submissionId
            );
            
            return {
              ...tender,
              status: 'Winner Selected',
              winner: winningSubmission?.vendorName
            };
          }
          return tender;
        })
      );
      
      toast({
        title: "Winner Selected",
        description: "The tender winner has been successfully selected and notifications will be sent to all participants.",
      });
      
      setSelectingWinner({ tenderId: null, submissionId: null });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tender Results</h1>
          <p className="text-muted-foreground">Review evaluations and select winners</p>
        </div>

        <div className="space-y-6">
          {results.map((tender) => (
            <Card key={tender.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{tender.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {tender.evaluationsCompleted} of {tender.evaluators} evaluations completed
                    </div>
                  </div>
                  <Badge variant={tender.status === 'Winner Selected' ? 'secondary' : 'default'}>
                    {tender.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {tender.winner && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/10 flex items-center">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-medium">Winner: {tender.winner}</span>
                  </div>
                )}

                <h3 className="text-lg font-medium mb-3">Ranked Submissions</h3>
                
                <div className="space-y-4">
                  {tender.submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full h-7 w-7 flex items-center justify-center text-white font-medium ${submission.rank === 1 ? 'bg-amber-500' : submission.rank === 2 ? 'bg-zinc-400' : 'bg-amber-700'}`}>
                            {submission.rank}
                          </div>
                          <span className="font-medium">{submission.vendorName}</span>
                          {tender.winner === submission.vendorName && (
                            <Badge variant="secondary" className="ml-2">Winner</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-lg">{submission.score}</span>
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>
                      </div>

                      <Progress value={submission.score} max={100} className="h-2 mb-4" />

                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium">Evaluator Scores:</h4>
                        {submission.evaluations.map((evaluation, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {evaluation.evaluator.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{evaluation.evaluator}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-500" />
                              <span>{evaluation.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {tender.status !== 'Winner Selected' && (
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => handleSelectWinner(tender.id, submission.id)}
                            variant={submission.rank === 1 ? "default" : "outline"}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            Select as Winner
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/30 p-4">
                {tender.status === 'Pending Decision' ? (
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <InfoIcon className="h-4 w-4 inline mr-1" />
                      Select a winner to complete the tender process
                    </div>
                    <Button 
                      className="gap-2"
                      onClick={() => handleSelectWinner(tender.id, tender.submissions[0].id)}
                    >
                      <Trophy className="h-4 w-4" />
                      Select Winner
                    </Button>
                  </div>
                ) : (
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                      Winner has been selected
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Select Winner Dialog */}
      <Dialog 
        open={selectingWinner.tenderId !== null} 
        onOpenChange={(open) => !open && setSelectingWinner({ tenderId: null, submissionId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Winner Selection</DialogTitle>
            <DialogDescription>
              You are about to select a winner for this tender. This action will notify all participants and cannot be easily reversed.
            </DialogDescription>
          </DialogHeader>
          
          {selectingWinner.tenderId && selectingWinner.submissionId && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-md">
                <Trophy className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">
                    {results
                      .find(tender => tender.id === selectingWinner.tenderId)?.submissions
                      .find(sub => sub.id === selectingWinner.submissionId)?.vendorName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: {results
                      .find(tender => tender.id === selectingWinner.tenderId)?.submissions
                      .find(sub => sub.id === selectingWinner.submissionId)?.score} points
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmWinner}>
              <Award className="h-4 w-4 mr-2" />
              Confirm Winner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Results;
