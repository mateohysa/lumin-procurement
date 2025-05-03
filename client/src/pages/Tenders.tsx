
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  InfoIcon,
  Calendar,
  FilePlus,
  Edit,
  Users,
  Trophy,
  Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

// Mock tender data
const tenders = [
  {
    id: 1,
    title: 'Office Equipment Procurement',
    description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-05-30',
    submissions: 4,
    evaluators: 2
  },
  {
    id: 2,
    title: 'IT Services Procurement',
    description: 'Looking for a provider of IT services, including network maintenance, cybersecurity, and cloud solutions.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-15',
    submissions: 7,
    evaluators: 3
  },
  {
    id: 3,
    title: 'Construction Services',
    description: 'Requesting bids for construction services for a new office building.',
    category: 'Construction',
    status: 'Open',
    deadline: '2025-07-01',
    submissions: 3,
    evaluators: 2
  },
  {
    id: 4,
    title: 'Office Supplies Contract',
    description: 'Recurring supply of office materials including paper, pens, and other stationery items.',
    category: 'Supply',
    status: 'Open',
    deadline: '2025-05-20',
    submissions: 5,
    evaluators: 1
  },
  {
    id: 5,
    title: 'Networking Equipment',
    description: 'Procurement of routers, switches, and other networking equipment for a new data center.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-10',
    submissions: 6,
    evaluators: 2
  },
  {
    id: 6,
    title: 'Building Renovation',
    description: 'Renovation of an existing government building, including structural repairs and interior updates.',
    category: 'Construction',
    status: 'Closed',
    deadline: '2025-04-15',
    submissions: 8,
    evaluators: 3,
    winner: 'Superior Construction Co.'
  },
];

// Mock tender evaluation results data
const tenderResults = {
  1: {
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
  6: {
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
};

const Tenders = () => {
  const [selectingWinner, setSelectingWinner] = useState<{ tenderId: number | null, submissionId: number | null }>({
    tenderId: null,
    submissionId: null
  });
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [currentTenderId, setCurrentTenderId] = useState<number | null>(null);
  const navigate = useNavigate();

  const filteredTendersByStatus = (status: string) => {
    if (status === 'all') return tenders;
    return tenders.filter(tender => tender.status.toLowerCase() === status.toLowerCase());
  };

  const handleShowResults = (tenderId: number) => {
    // Instead of opening dialog, navigate to the submissions page
    navigate(`/tenders/${tenderId}/submissions`);
  };

  const handleSelectWinner = (tenderId: number, submissionId: number) => {
    setSelectingWinner({ tenderId, submissionId });
  };
  
  const confirmWinner = () => {
    if (selectingWinner.tenderId && selectingWinner.submissionId) {
      // Here you would update your state or call an API to set the winner
      
      toast({
        title: "Winner Selected",
        description: "The tender winner has been successfully selected and notifications will be sent to all participants.",
      });
      
      setSelectingWinner({ tenderId: null, submissionId: null });
    }
  };

  const renderTenderCard = (tender: any) => (
    <Card key={tender.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tender.title}</CardTitle>
          <Badge variant={tender.status === 'Open' ? 'default' : 'secondary'}>
            {tender.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {tender.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Deadline: {tender.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{tender.category}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Evaluators: {tender.evaluators}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-blue-50">Submissions: {tender.submissions}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          {tender.status === 'Open' ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/tenders/${tender.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleShowResults(tender.id)}
            >
              <Trophy className="mr-2 h-4 w-4 text-amber-500" />
              Results
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tenders/${tender.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tenders</h1>
            <p className="text-muted-foreground">Manage all procurement tenders</p>
          </div>
          <Button asChild>
            <Link to="/create-tender">
              <FilePlus className="mr-2 h-4 w-4" />
              Create Tender
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tenders</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('all').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="open" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('open').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="closed" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('closed').map(renderTenderCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Tender Results: {tenders.find(t => t.id === currentTenderId)?.title}
            </DialogTitle>
            <DialogDescription>
              Review evaluations and select winners
            </DialogDescription>
          </DialogHeader>

          {currentTenderId && tenderResults[currentTenderId] && (
            <div className="py-4">
              {tenderResults[currentTenderId].winner && (
                <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/10 flex items-center">
                  <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="font-medium">Winner: {tenderResults[currentTenderId].winner}</span>
                </div>
              )}

              <h3 className="text-lg font-medium mb-3">Ranked Submissions</h3>
              
              <div className="space-y-4">
                {tenderResults[currentTenderId].submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full h-7 w-7 flex items-center justify-center text-white font-medium ${submission.rank === 1 ? 'bg-amber-500' : submission.rank === 2 ? 'bg-zinc-400' : 'bg-amber-700'}`}>
                          {submission.rank}
                        </div>
                        <span className="font-medium">{submission.vendorName}</span>
                        {tenderResults[currentTenderId].winner === submission.vendorName && (
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
                            <span>{evaluation.evaluator}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{evaluation.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {tenderResults[currentTenderId].status !== 'Winner Selected' && (
                      <div className="mt-4 flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectWinner(currentTenderId, submission.id)}
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
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowResultsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    {tenderResults[selectingWinner.tenderId]?.submissions
                      .find(sub => sub.id === selectingWinner.submissionId)?.vendorName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: {tenderResults[selectingWinner.tenderId]?.submissions
                      .find(sub => sub.id === selectingWinner.submissionId)?.score} points
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectingWinner({ tenderId: null, submissionId: null })}>
              Cancel
            </Button>
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

export default Tenders;
