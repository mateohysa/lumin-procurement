import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  Building,
  Users,
  CheckCircle,
  ExternalLink,
  Flag
} from 'lucide-react';
import { RoleBasedSubmissionAccess } from '@/components/tenders/RoleBasedSubmissionAccess';
import { useAuth } from '@/contexts/AuthContext';
import { DisputeButton } from '@/components/disputes/DisputeButton';

// Mock tender data
const tenderData = {
  id: '123',
  title: 'Office Equipment Procurement',
  description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
  category: 'Equipment',
  status: 'open',
  deadline: '2025-04-30',
  endDate: '2025-05-01',
  budget: '$50,000',
  organization: 'Ministry of Education',
  publishDate: '2025-04-01',
  documents: [
    { id: 1, name: 'Tender Specification Document', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Equipment Requirements', type: 'docx', size: '1.8 MB' },
    { id: 3, name: 'Evaluation Criteria', type: 'pdf', size: '1.1 MB' }
  ],
  winner: {
    id: 'vendor-456',
    name: 'Office Solutions Inc.',
    score: 92,
    submissionDate: '2025-04-15'
  },
  disputeTimeFrameDays: 7
};

const TenderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // In reality you'd fetch tender details by ID; here we override mock status for open-tender testing
  const numericId = Number(id);
  // Treat IDs below 6 as open tenders for mock
  console.log(tenderData);
  const isOpenTender = tenderData.status === 'open';
  const tender = {
    ...tenderData,
    status: numericId < 6 ? 'Open' : tenderData.status,
  };
  
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';
  const canSeeWinner = tender.status === 'Awarded';
  const isWinner = isVendor && user?.id === tender.winner?.id;
  
  // Check if the current vendor is not the winner (can file a dispute)
  const canFileDispute = isVendor && user?.id !== tender.winner?.id && tender.status === 'Awarded';
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
          <div>
            <Button variant="outline" size="sm" className="mb-2" asChild>
              <Link to="/tenders">
                Back to Tenders
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{tender.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge>{tender.status}</Badge>
              <Badge variant="outline">{tender.category}</Badge>
              <div className="text-sm text-muted-foreground">ID: {tender.id}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isAdmin && tender.status !== 'Draft' && (
              <Button variant="outline" asChild>
                <Link to={`/tenders/${id}/edit`}>
                  Edit Tender
                </Link>
              </Button>
            )}
            {/* Hide View Submissions on open tenders */}
            {!isOpenTender && <RoleBasedSubmissionAccess tenderId={id || ''} />}
            {isAdmin && tender.status === 'Under Review' && (
              <Button variant="default">
                Announce Winner
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tender Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p>{tender.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline</span>
                    </div>
                    <div>{tender.deadline}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Budget</span>
                    </div>
                    <div>{tender.budget}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>Organization</span>
                    </div>
                    <div>{tender.organization}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Published</span>
                    </div>
                    <div>{tender.publishDate}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Tender Documents</h3>
                  <div className="space-y-2">
                    {tender.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{doc.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({doc.size})</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hide Winner on open tenders */}
            {!isOpenTender && canSeeWinner && tender.winner && (
              <Card className={isWinner ? "border-green-200 bg-green-50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className={`h-5 w-5 ${isWinner ? "text-green-500" : "text-blue-500"}`} />
                      Winner
                    </CardTitle>
                    {isWinner && (
                      <Badge className="bg-green-100 text-green-800">You won this tender</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Vendor</div>
                      <div className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {tender.winner.name}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Evaluation Score</div>
                      <div className="font-medium">{tender.winner.score}/100</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Winner announced on {tender.endDate}
                    </div>
                    
                    {canFileDispute && (
                      <DisputeButton
                        tenderId={tender.id}
                        tenderTitle={tender.title}
                        winnerId={tender.winner.id}
                        winnerName={tender.winner.name}
                        tenderEndDate={tender.endDate}
                        disputeTimeFrameDays={tender.disputeTimeFrameDays}
                      />
                    )}
                  </div>

                  {isAdmin && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                        <Link to={`/tenders/${tender.id}/disputes`}>
                          <Flag className="h-4 w-4" />
                          View Disputes
                          <Badge variant="secondary" className="ml-1">2</Badge>
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8">
                  <div className="absolute left-2 h-full w-0.5 bg-muted-foreground/20"></div>
                  
                  <div className="relative mb-6">
                    <div className="absolute left-[-1.75rem] w-4 h-4 rounded-full bg-primary"></div>
                    <div className="text-sm text-muted-foreground mb-1">Published</div>
                    <div className="font-medium">{tender.publishDate}</div>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute left-[-1.75rem] w-4 h-4 rounded-full bg-primary"></div>
                    <div className="text-sm text-muted-foreground mb-1">Submission Deadline</div>
                    <div className="font-medium">{tender.deadline}</div>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute left-[-1.75rem] w-4 h-4 rounded-full bg-primary"></div>
                    <div className="text-sm text-muted-foreground mb-1">Winner Announced</div>
                    <div className="font-medium">{tender.endDate}</div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-1.75rem] w-4 h-4 rounded-full bg-muted-foreground/50"></div>
                    <div className="text-sm text-muted-foreground mb-1">Dispute Window Ends</div>
                    <div className="font-medium">
                      {(() => {
                        const endDate = new Date(tender.endDate);
                        endDate.setDate(endDate.getDate() + tender.disputeTimeFrameDays);
                        return endDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vendors can file disputes up to {tender.disputeTimeFrameDays} days after winner announcement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TenderDetail;
