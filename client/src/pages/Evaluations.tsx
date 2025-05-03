
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FileText, Flag, Check, Clock, XCircle, Search, AlertCircle, Filter } from 'lucide-react';

// Mock data for tenders under evaluation
const tenders = [
  { 
    id: 'T-2023-42', 
    title: 'IT Infrastructure Upgrade', 
    deadline: '2025-05-15',
    submissions: 5,
    evaluationsCompleted: 2,
    evaluationsRequired: 3,
    priority: 'high'
  },
  { 
    id: 'T-2023-41', 
    title: 'Office Furniture Procurement', 
    deadline: '2025-05-18',
    submissions: 4,
    evaluationsCompleted: 0,
    evaluationsRequired: 3,
    priority: 'medium'
  },
  { 
    id: 'T-2023-40', 
    title: 'Consulting Services', 
    deadline: '2025-05-05',
    submissions: 3,
    evaluationsCompleted: 3,
    evaluationsRequired: 3,
    priority: 'low'
  },
  { 
    id: 'T-2023-39', 
    title: 'Marketing Campaign', 
    deadline: '2025-05-12',
    submissions: 6,
    evaluationsCompleted: 1,
    evaluationsRequired: 3,
    priority: 'high'
  }
];

// Mock data for vendor submissions for a specific tender
const vendorSubmissions = [
  { 
    id: 'S-001', 
    vendorName: 'TechSolutions Inc.', 
    submissionDate: '2025-04-20',
    files: 4,
    evaluated: false,
    aiStatus: 'complete' // complete, missing, issues
  },
  { 
    id: 'S-002', 
    vendorName: 'Creative Design Studio', 
    submissionDate: '2025-04-22',
    files: 3,
    evaluated: true,
    aiStatus: 'complete'
  },
  { 
    id: 'S-003', 
    vendorName: 'Global Consulting Group', 
    submissionDate: '2025-04-25',
    files: 5,
    evaluated: false,
    aiStatus: 'missing'
  },
  { 
    id: 'S-004', 
    vendorName: 'Future Innovations Ltd', 
    submissionDate: '2025-04-27',
    files: 3,
    evaluated: false,
    aiStatus: 'issues'
  },
  { 
    id: 'S-005', 
    vendorName: 'SmartBuild Construction', 
    submissionDate: '2025-04-28',
    files: 4,
    evaluated: true,
    aiStatus: 'complete'
  }
];

// Evaluation criteria for scoring
const evaluationCriteria = [
  { id: 'technical', name: 'Technical Solution', weight: 30 },
  { id: 'experience', name: 'Experience & Expertise', weight: 25 },
  { id: 'timeline', name: 'Implementation Timeline', weight: 15 },
  { id: 'budget', name: 'Budget & Cost Efficiency', weight: 30 }
];

export default function Evaluations() {
  const [selectedTender, setSelectedTender] = React.useState<string | null>(null);
  const [showingSubmissions, setShowingSubmissions] = React.useState(false);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = React.useState(false);
  const [activeVendor, setActiveVendor] = React.useState<typeof vendorSubmissions[0] | null>(null);
  const [scores, setScores] = React.useState<Record<string, number>>({});
  const [comments, setComments] = React.useState<Record<string, string>>({});
  const [flagged, setFlagged] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Handle tender selection
  const handleSelectTender = (tenderId: string) => {
    setSelectedTender(tenderId);
    setShowingSubmissions(true);
  };
  
  // Go back to tender list
  const handleBackToTenders = () => {
    setShowingSubmissions(false);
    setSelectedTender(null);
  };
  
  // Open evaluation dialog for a vendor
  const openEvaluationDialog = (vendor: typeof vendorSubmissions[0]) => {
    setActiveVendor(vendor);
    // Reset form data
    setScores({});
    setComments({});
    setFlagged(false);
    setEvaluationDialogOpen(true);
  };
  
  // Handle score changes
  const handleScoreChange = (criterionId: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: parseInt(value, 10)
    }));
  };
  
  // Handle comment changes
  const handleCommentChange = (criterionId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };
  
  // Submit evaluation
  const submitEvaluation = () => {
    // Check if all criteria have scores
    const allCriteriaScored = evaluationCriteria.every(criterion => 
      scores[criterion.id] !== undefined
    );
    
    // Check if all criteria have comments
    const allCriteriaCommented = evaluationCriteria.every(criterion => 
      comments[criterion.id]?.trim() !== ""
    );
    
    if (!allCriteriaScored) {
      toast({
        title: "Missing scores",
        description: "Please provide scores for all evaluation criteria.",
        variant: "destructive",
      });
      return;
    }
    
    if (!allCriteriaCommented) {
      toast({
        title: "Missing justifications",
        description: "Please provide comments to justify all your scores.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the evaluation data to your backend
    console.log("Evaluation data:", { 
      vendorId: activeVendor?.id,
      tenderId: selectedTender,
      scores,
      comments,
      flagged
    });
    
    toast({
      title: "Evaluation submitted",
      description: `Your evaluation for ${activeVendor?.vendorName} has been recorded.`,
    });
    
    setEvaluationDialogOpen(false);
    
    // Update local state to reflect the evaluation
    // This would typically be managed by your state management solution
  };

  // Calculate status for a tender
  const getTenderStatus = (tender: typeof tenders[0]) => {
    if (tender.evaluationsCompleted === tender.evaluationsRequired) {
      return "completed";
    } else if (tender.evaluationsCompleted > 0) {
      return "in-progress";
    } else {
      return "pending";
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get AI status badge
  const getAiStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge variant="outline" className="bg-green-50 text-green-800">Complete</Badge>;
      case "missing":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Missing Documents</Badge>;
      case "issues":
        return <Badge variant="outline" className="bg-red-50 text-red-800">Issues Detected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter tenders based on search term and status filter
  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = 
      tender.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tender.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && getTenderStatus(tender) === 'completed') ||
      (filterStatus === 'in-progress' && getTenderStatus(tender) === 'in-progress') ||
      (filterStatus === 'pending' && getTenderStatus(tender) === 'pending') ||
      (filterStatus === 'due-soon' && new Date(tender.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Panel</h1>
          <p className="text-muted-foreground mt-2">
            Review and score tender submissions from vendors.
          </p>
        </div>

        {!showingSubmissions ? (
          <Card>
            <CardHeader className="pb-3 flex flex-col md:flex-row justify-between">
              <CardTitle>Tenders Awaiting Evaluation</CardTitle>
              <div className="flex flex-col gap-3 sm:flex-row mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tenders..." 
                    className="pl-8 w-full sm:w-[200px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <Button 
                    variant={filterStatus === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterStatus === 'completed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('completed')}
                    className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Completed
                  </Button>
                  <Button 
                    variant={filterStatus === 'in-progress' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('in-progress')}
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    In Progress
                  </Button>
                  <Button 
                    variant={filterStatus === 'due-soon' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('due-soon')}
                    className="bg-red-50 text-red-800 hover:bg-red-100 border-red-200"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Due Soon
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tender ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No tenders found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenders.map((tender) => {
                        const status = getTenderStatus(tender);
                        const progressPercentage = (tender.evaluationsCompleted / tender.evaluationsRequired) * 100;
                        const isDueSoon = new Date(tender.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                        
                        return (
                          <TableRow key={tender.id} className="group">
                            <TableCell className="font-medium">{tender.id}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              <div className="flex items-center gap-2">
                                {tender.title}
                                {isDueSoon && (
                                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                    ⏰ Due Soon
                                  </span>
                                )}
                                {tender.priority === 'high' && (
                                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                                    High Priority
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(tender.deadline).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </TableCell>
                            <TableCell>{tender.submissions}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1.5">
                                <Progress value={progressPercentage} className="h-2" />
                                <span className="text-xs text-muted-foreground">
                                  {tender.evaluationsCompleted}/{tender.evaluationsRequired} evaluations
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(status)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                onClick={() => handleSelectTender(tender.id)} 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToTenders}>
                Back to Tenders
              </Button>
              <Badge variant="outline" className="text-base px-4 py-1">
                {selectedTender}
              </Badge>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  {tenders.find(t => t.id === selectedTender)?.title} - Vendor Submissions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and evaluate each vendor submission separately.
                </p>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submission ID</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Submitted On</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>AI Status</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorSubmissions.map((submission) => (
                        <TableRow key={submission.id} className="group">
                          <TableCell className="font-medium">{submission.id}</TableCell>
                          <TableCell>{submission.vendorName}</TableCell>
                          <TableCell>
                            {new Date(submission.submissionDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{submission.files}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getAiStatusBadge(submission.aiStatus)}
                          </TableCell>
                          <TableCell>
                            {submission.evaluated ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Evaluated
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => openEvaluationDialog(submission)}
                              variant={submission.evaluated ? "outline" : "default"}
                              size="sm"
                              className={`${submission.evaluated ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}
                            >
                              {submission.evaluated ? "Review" : "Evaluate"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Evaluation Dialog */}
      <Dialog open={evaluationDialogOpen} onOpenChange={setEvaluationDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Evaluate Submission: {activeVendor?.vendorName}
              {activeVendor?.aiStatus === 'issues' && (
                <Badge variant="destructive" className="ml-2">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Issues Detected
                </Badge>
              )}
              {activeVendor?.aiStatus === 'missing' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 ml-2">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Missing Documents
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Score each criterion from 1-5 and provide justification for your scores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="technical">
              <TabsList className="grid grid-cols-4 mb-4">
                {evaluationCriteria.map((criterion) => (
                  <TabsTrigger key={criterion.id} value={criterion.id}>
                    {criterion.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {evaluationCriteria.map((criterion) => (
                <TabsContent key={criterion.id} value={criterion.id} className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">{criterion.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Weight: {criterion.weight}% of total score
                    </p>
                    
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Score (1-5)
                        </label>
                        <select 
                          className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          value={scores[criterion.id] || ""}
                          onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                        >
                          <option value="">Select a score</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Below Average</option>
                          <option value="3">3 - Average</option>
                          <option value="4">4 - Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>

                        {criterion.id === 'budget' && activeVendor?.aiStatus === 'issues' && (
                          <div className="mt-3 text-sm bg-red-50 text-red-800 p-2 rounded border border-red-200">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            AI Warning: Budget document appears incomplete or miscalculated.
                          </div>
                        )}

                        {criterion.id === 'experience' && activeVendor?.aiStatus === 'missing' && (
                          <div className="mt-3 text-sm bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            AI Warning: CV documents are missing from this submission.
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Justification (Required)
                        </label>
                        <Textarea 
                          placeholder={`Explain your score for ${criterion.name}...`}
                          className="min-h-[120px]"
                          value={comments[criterion.id] || ""}
                          onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                        />
                      </div>

                      {criterion.id === 'technical' && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <h5 className="text-sm font-medium text-blue-800 mb-2">AI-Assisted Evaluation</h5>
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 mb-3">
                            <Search className="h-3.5 w-3.5 mr-1" />
                            Scan Documents for Technical Points
                          </Button>
                          <p className="text-xs text-blue-700">
                            AI can scan the vendor's documents and highlight relevant technical specifications, technologies mentioned, and implementation approaches.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-6 flex items-center gap-2">
              <Checkbox 
                id="flag-submission" 
                checked={flagged}
                onCheckedChange={(checked) => setFlagged(checked === true)}
              />
              <label htmlFor="flag-submission" className="flex items-center text-sm font-medium gap-2">
                <Flag className="h-4 w-4 text-destructive" />
                Flag this submission for special review
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvaluationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEvaluation}>
              Submit Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
