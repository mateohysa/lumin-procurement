import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Search, 
  Filter,
  Star,
  FileText,
  Building
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Initial static completed evaluations
const initialCompleted = [
  { id: 'E-001', tender: { id: 'T-2023-38', title: 'Website Redesign Project' }, vendor: 'Digital Solutions Ltd', completedDate: '2025-04-28', score: 4.2, status: 'completed' },
  { id: 'E-002', tender: { id: 'T-2023-37', title: 'Network Infrastructure Upgrade' }, vendor: 'NetTech Systems', completedDate: '2025-04-25', score: 3.8, status: 'completed' },
  { id: 'E-003', tender: { id: 'T-2023-36', title: 'Office Supplies Procurement' }, vendor: 'Office Essentials Inc.', completedDate: '2025-04-20', score: 4.5, status: 'completed' },
  { id: 'E-004', tender: { id: 'T-2023-35', title: 'Staff Training Services' }, vendor: 'Learning Solutions Group', completedDate: '2025-04-15', score: 4.0, status: 'completed' }
];

const CompletedEvaluations = () => {
  // Load and persist completed list from localStorage
  const [completedList, setCompletedList] = React.useState<typeof initialCompleted>([]);
  React.useEffect(() => {
    const stored = localStorage.getItem('completedEvaluations');
    if (stored) {
      setCompletedList(JSON.parse(stored));
    } else {
      localStorage.setItem('completedEvaluations', JSON.stringify(initialCompleted));
      setCompletedList(initialCompleted);
    }
  }, []);

  const renderStars = (score: number) => (
    <span className="text-sm font-medium">{`${score.toFixed(1)}/5`}</span>
  );
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Completed Evaluations</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search evaluations..." 
                className="pl-9 w-full md:w-[240px]" 
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-green-500" />
              My Completed Evaluations
            </CardTitle>
            <CardDescription>
              Review your previously completed evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Completed On</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedList.map(evaluation => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.tender.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {evaluation.vendor}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(evaluation.completedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{renderStars(evaluation.score)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/evaluation-detail/${evaluation.id}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {completedList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No completed evaluations</h3>
                <p className="text-muted-foreground">You haven't completed any evaluations yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CompletedEvaluations;
