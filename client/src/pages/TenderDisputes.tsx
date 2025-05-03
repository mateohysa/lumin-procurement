
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DisputesList, type Dispute } from '@/components/disputes/DisputesList';
import { DisputeDetail } from '@/components/disputes/DisputeDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock tender data
const tenderData = {
  id: '123',
  title: 'Office Equipment Procurement',
  currentWinner: {
    id: 'vendor-456',
    name: 'Office Solutions Inc.'
  }
};

// Mock disputes data
const mockDisputes: Dispute[] = [
  {
    id: "disp-1",
    tenderId: "123",
    tenderTitle: "Office Equipment Procurement",
    vendorId: "vendor-789",
    vendorName: "Tech Office Pro",
    reason: "Our bid offered a better warranty package (5 years vs 3 years) and our equipment has higher energy efficiency ratings which would result in cost savings over time. We believe these factors were not properly weighted in the evaluation.",
    status: "pending",
    createdAt: "2025-05-02T10:30:00",
  },
  {
    id: "disp-2",
    tenderId: "123",
    tenderTitle: "Office Equipment Procurement",
    vendorId: "vendor-101",
    vendorName: "Business Equipment Specialists",
    reason: "We have concerns about the compliance of the winning bid with the technical specifications. Specifically, the memory requirements for computers and the resolution requirements for printers do not meet the minimum specifications outlined in the tender document.",
    status: "pending",
    createdAt: "2025-05-03T14:20:00",
  }
];

const TenderDisputes = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [tender, setTender] = useState(tenderData);
  
  useEffect(() => {
    // In a real app, these would be API calls
    setDisputes(mockDisputes);
  }, [id]);

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleStatusChange = async (disputeId: string, status: 'rejected' | 'accepted', response: string) => {
    // In a real app, this would be an API call
    console.log('Status change:', { tenderId: id, disputeId, status, response });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state
    setDisputes(prevDisputes => 
      prevDisputes.map(d => 
        d.id === disputeId 
          ? { 
              ...d, 
              status, 
              responseText: response, 
              resolvedAt: new Date().toISOString() 
            } 
          : d
      )
    );
    
    // If the dispute was accepted, we would change the tender winner
    if (status === 'accepted') {
      toast({
        title: "Winner changed",
        description: "The dispute has been accepted and the tender winner has been updated.",
      });
      
      // Update winner (in real app, this would be done via API)
      // This is just a mock demonstration
      setTender({
        ...tender,
        currentWinner: {
          id: selectedDispute?.vendorId || '',
          name: selectedDispute?.vendorName || ''
        }
      });
    } else {
      toast({
        title: "Dispute rejected",
        description: "The dispute has been rejected and the tender winner remains unchanged.",
      });
    }
    
    return true;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="outline" size="sm" className="mb-2" asChild>
              <Link to={`/tenders/${id}`}>
                Back to Tender Details
              </Link>
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              Disputes for {tender.title}
            </h1>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Winner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{tender.currentWinner.name}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Disputes ({disputes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DisputesList
              disputes={disputes}
              isAdmin={user?.role === 'admin'}
              onViewDispute={handleViewDispute}
            />
          </CardContent>
        </Card>

        <DisputeDetail
          dispute={selectedDispute}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onStatusChange={user?.role === 'admin' ? handleStatusChange : undefined}
        />
      </div>
    </MainLayout>
  );
};

export default TenderDisputes;
