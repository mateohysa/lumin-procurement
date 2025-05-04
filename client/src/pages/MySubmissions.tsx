import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Edit, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DisputeButton } from '@/components/disputes/DisputeButton';

// submissions data
const submissions = [
  {
    id: '123',
    tenderId: '45',
    tenderTitle: 'Office Equipment Procurement',
    submissionDate: '2025-04-15',
    status: 'Submitted',
    documents: [
      { id: 'doc1', name: 'proposal_office_equip.pdf', type: 'pdf', size: '120 KB' },
      { id: 'doc2', name: 'budget_office_equip.xlsx', type: 'excel', size: '80 KB' },
    ],
    evaluations: [
      { evaluatorName: 'John Doe', score: 85, comments: 'Well-structured proposal.' },
      { evaluatorName: 'Jane Smith', score: 78, comments: 'Budget seems a bit high.' },
    ],
  },
  {
    id: '124',
    tenderId: '46',
    tenderTitle: 'IT Services Contract',
    submissionDate: '2025-04-10',
    status: 'Under Review',
    documents: [
      { id: 'doc3', name: 'proposal_it_services.pdf', type: 'pdf', size: '200 KB' },
      { id: 'doc4', name: 'team_profile.docx', type: 'docx', size: '50 KB' },
    ],
    evaluations: [
      { evaluatorName: 'Alice Brown', score: 90, comments: 'Excellent team credentials.' },
    ],
  },
  {
    id: '125',
    tenderId: '47',
    tenderTitle: 'Building Maintenance',
    submissionDate: '2025-04-03',
    status: 'Rejected',
    rejectionDate: '2025-05-01', // Add rejection date for calculating dispute window
    documents: [
      { id: 'doc5', name: 'proposal_maintenance.pdf', type: 'pdf', size: '150 KB' },
    ],
    evaluations: [
      { evaluatorName: 'Mark Lee', score: 60, comments: 'Details missing on material costs.' },
    ],
  },
  {
    id: '126',
    tenderId: '48',
    tenderTitle: 'Security Services',
    submissionDate: '2025-04-01',
    status: 'Won',
    documents: [
      { id: 'doc6', name: 'proposal_security.pdf', type: 'pdf', size: '180 KB' },
      { id: 'doc7', name: 'certificate_security.docx', type: 'docx', size: '40 KB' },
    ],
    evaluations: [
      { evaluatorName: 'Emily Davis', score: 92, comments: 'Very comprehensive security plan.' },
      { evaluatorName: 'Peter Johnson', score: 88, comments: 'Good experience and references.' },
    ],
  },
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
                  <TableHead>Evaluations</TableHead>
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
                          {submission.documents.map((doc) => (
                            <span key={doc.id} className="ml-2">
                              {doc.name}
                            </span>
                          ))}
                        </span>
                      </TableCell>
                      <TableCell>
                        {submission.evaluations.map(ev => (
                          <div key={ev.evaluatorName} className="text-sm">
                            <span className="font-medium">{ev.evaluatorName}</span>: {ev.score} (<span className="italic">{ev.comments}</span>)
                          </div>
                        ))}
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