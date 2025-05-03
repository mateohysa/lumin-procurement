
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Download, Clock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Sample data for recent tenders
const recentTenders = [
  {
    id: 'T-2023-42',
    title: 'IT Infrastructure Upgrade',
    status: 'open',
    submissions: 8,
    deadline: '2025-05-15',
    category: 'IT Services'
  },
  {
    id: 'T-2023-41',
    title: 'Office Furniture Procurement',
    status: 'review',
    submissions: 12,
    deadline: '2025-05-10',
    category: 'Equipment'
  },
  {
    id: 'T-2023-40',
    title: 'Consulting Services - Strategic Plan',
    status: 'closed',
    submissions: 5,
    deadline: '2025-04-25',
    category: 'Professional Services'
  },
  {
    id: 'T-2023-39',
    title: 'Marketing Campaign Implementation',
    status: 'closed',
    submissions: 7,
    deadline: '2025-04-20',
    category: 'Marketing'
  }
];

export function RecentTenders() {
  // Function to calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="status-badge-open">Open</span>;
      case 'review':
        return <span className="status-badge-review">In Review</span>;
      case 'closed':
        return <span className="status-badge-closed">Closed</span>;
      default:
        return <span className="status-badge-closed">{status}</span>;
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Recent Tenders</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="pb-2 font-medium text-left">ID</th>
                <th className="pb-2 font-medium text-left">Title</th>
                <th className="pb-2 font-medium text-left">Status</th>
                <th className="pb-2 font-medium text-left">Category</th>
                <th className="pb-2 font-medium text-center">Submissions</th>
                <th className="pb-2 font-medium text-right">Deadline</th>
                <th className="pb-2 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {recentTenders.map((tender) => (
                <tr key={tender.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 text-sm">{tender.id}</td>
                  <td className="py-3 text-sm font-medium">{tender.title}</td>
                  <td className="py-3 text-sm">{renderStatusBadge(tender.status)}</td>
                  <td className="py-3 text-sm">{tender.category}</td>
                  <td className="py-3 text-sm text-center">{tender.submissions}</td>
                  <td className="py-3 text-sm text-right">
                    {tender.status !== 'closed' ? (
                      <div className="flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" /> 
                        <span className={getDaysRemaining(tender.deadline) < 3 ? 'text-destructive' : ''}>
                          {getDaysRemaining(tender.deadline)} days
                        </span>
                      </div>
                    ) : (
                      tender.deadline
                    )}
                  </td>
                  <td className="py-3 text-sm text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Download className="mr-2 h-4 w-4" /> Export Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
