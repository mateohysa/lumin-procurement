
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Filter
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data
const evaluations = [
  {
    id: 'E-101',
    tender: {
      id: 'T-2023-41',
      title: 'Office Furniture Procurement'
    },
    vendor: 'Furniture Solutions Inc.',
    submissionDate: '2025-05-10',
    deadline: '2025-05-18',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'E-102',
    tender: {
      id: 'T-2023-39',
      title: 'IT Services Consultation'
    },
    vendor: 'TechExperts Group',
    submissionDate: '2025-05-08',
    deadline: '2025-05-15',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'E-103',
    tender: {
      id: 'T-2023-40',
      title: 'Marketing Materials Design'
    },
    vendor: 'Creative Solutions Agency',
    submissionDate: '2025-05-05',
    deadline: '2025-05-20',
    status: 'pending',
    priority: 'low'
  }
];

const MyEvaluations = () => {
  const { toast } = useToast();
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600 font-medium">Overdue</span>;
    } else if (diffDays === 0) {
      return <span className="text-red-600 font-medium">Due Today</span>;
    } else if (diffDays === 1) {
      return <span className="text-amber-600 font-medium">1 day</span>;
    } else if (diffDays <= 3) {
      return <span className="text-amber-600 font-medium">{diffDays} days</span>;
    } else {
      return <span className="text-muted-foreground">{diffDays} days</span>;
    }
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Documents downloaded",
      description: `Submission documents for evaluation ${id} have been downloaded.`
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">My Evaluations</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search evaluations..." 
                className="pl-9 w-full md:w-[240px]" 
              />
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Evaluations</CardTitle>
            <CardDescription>
              All evaluations waiting for your assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tender</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map(evaluation => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.id}</TableCell>
                    <TableCell>{evaluation.tender.title}</TableCell>
                    <TableCell>{evaluation.vendor}</TableCell>
                    <TableCell>{new Date(evaluation.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getDaysRemaining(evaluation.deadline)}</TableCell>
                    <TableCell>{getPriorityBadge(evaluation.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleDownload(evaluation.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8"
                          asChild
                        >
                          <Link to={`/evaluation-form/${evaluation.id}`}>
                            Evaluate
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {evaluations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No pending evaluations</h3>
                <p className="text-muted-foreground">You have completed all your assigned evaluations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MyEvaluations;
