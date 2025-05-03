import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Edit, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DisputeButton } from '@/components/disputes/DisputeButton';

// Mock submissions data
const submissions = [
  {
    id: '123',
    tenderId: '45',
    tenderTitle: 'Office Equipment Procurement',
    submissionDate: '2025-04-15',
    status: 'Submitted',
    documents: 4,
  },
  {
    id: '124',
    tenderId: '46',
    tenderTitle: 'IT Services Contract',
    submissionDate: '2025-04-10',
    status: 'Under Review',
    documents: 5,
  },
  {
    id: '125',
    tenderId: '47',
    tenderTitle: 'Building Maintenance',
    submissionDate: '2025-04-03',
    status: 'Rejected',
    rejectionDate: '2025-05-01', // Add rejection date for calculating dispute window
    documents: 3,
  },
  {
    id: '126',
    tenderId: '48',
    tenderTitle: 'Security Services',
    submissionDate: '2025-04-01',
    status: 'Won',
    documents: 6,
  }
];

const MySubmissions = () => {
  const [localDisputes, setLocalDisputes] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('localDisputes') || '[]');
      setLocalDisputes(stored);
    } catch {
      setLocalDisputes([]);
    }
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Submissions</h1>
            <p className="text-muted-foreground">Track and manage your tender submissions</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/available-tenders">Browse Tenders</Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tender Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const hasDispute = localDisputes.some(d => d.tenderId === submission.tenderId && d.disputeType === 'rejection');
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.tenderTitle}</TableCell>
                      <TableCell>{submission.submissionDate}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            submission.status === 'Won' 
                              ? "default" 
                              : submission.status === 'Rejected' 
                                ? "destructive" 
                                : "secondary"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-muted-foreground" /> 
                          {submission.documents}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/submissions/${submission.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          
                          {submission.status === 'Rejected' && (
                            hasDispute ? (
                              <Button variant="outline" size="sm" disabled>
                                Disputed
                              </Button>
                            ) : (
                              <DisputeButton
                                tenderId={submission.tenderId}
                                tenderTitle={submission.tenderTitle}
                                tenderEndDate={submission.rejectionDate || submission.submissionDate}
                                disputeTimeFrameDays={3}
                                disputeType="rejection"
                                variant="outline"
                                size="sm"
                              />
                            )
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MySubmissions;
