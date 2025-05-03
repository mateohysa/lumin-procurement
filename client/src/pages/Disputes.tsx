
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DisputesList, type Dispute } from '@/components/disputes/DisputesList';
import { DisputeDetail } from '@/components/disputes/DisputeDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock disputes data for demonstration
const mockDisputes: Dispute[] = [
  {
    id: "disp-1",
    tenderId: "tender-123",
    tenderTitle: "IT Infrastructure Upgrade",
    vendorId: "vendor-456",
    vendorName: "Tech Solutions Inc.",
    reason: "Our bid was more cost-effective and included additional services that were not considered in the evaluation. We believe our proposal provides better value for money.",
    status: "pending",
    createdAt: "2025-05-01T10:30:00",
  },
  {
    id: "disp-2",
    tenderId: "tender-456",
    tenderTitle: "Office Furniture Procurement",
    vendorId: "vendor-789",
    vendorName: "Modern Office Supplies",
    reason: "We have concerns about the technical evaluation. Our product quality ratings from independent testing labs are higher than the selected vendor.",
    status: "rejected",
    createdAt: "2025-04-25T14:20:00",
    responseText: "After a thorough review of the evaluation process, we found that all scoring was done according to the criteria specified in the tender documents. The winner scored higher on delivery timeline and warranty terms.",
    resolvedAt: "2025-04-28T09:15:00",
  },
  {
    id: "disp-3",
    tenderId: "tender-789",
    tenderTitle: "Network Security Implementation",
    vendorId: "vendor-123",
    vendorName: "SecureNet Systems",
    reason: "There appears to be a conflict of interest in the selection committee. One of the evaluators has previous employment history with the winning vendor.",
    status: "accepted",
    createdAt: "2025-04-20T11:45:00",
    responseText: "Upon investigation, we confirmed a previously undisclosed relationship between an evaluator and the winning vendor. The tender evaluation will be conducted again with a new evaluation committee.",
    resolvedAt: "2025-04-23T16:30:00",
  }
];

const Disputes = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    // In a real application, this would be an API call
    // Filter disputes based on user role
    if (user?.role === 'vendor') {
      // Vendors only see their own disputes
      setDisputes(mockDisputes.filter(dispute => dispute.vendorId === user.id));
    } else {
      // Admins see all disputes
      setDisputes(mockDisputes);
    }
  }, [user]);

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleStatusChange = async (disputeId: string, status: 'rejected' | 'accepted', response: string) => {
    // In a real app, this would be an API call
    console.log('Status change:', { disputeId, status, response });
    
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
    
    // Show success message
    toast({
      title: "Dispute updated",
      description: `The dispute status has been updated to ${status}.`,
    });
    
    return true;
  };

  const getFilteredDisputes = () => {
    switch (activeTab) {
      case 'pending':
        return disputes.filter(d => d.status === 'pending');
      case 'resolved':
        return disputes.filter(d => d.status === 'accepted' || d.status === 'rejected');
      default:
        return disputes;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Disputes Management</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === 'admin' ? 'Manage Tender Disputes' : 'My Disputes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Disputes</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4 space-y-4">
                <DisputesList
                  disputes={getFilteredDisputes()}
                  isAdmin={user?.role === 'admin'}
                  onViewDispute={handleViewDispute}
                />
              </TabsContent>
            </Tabs>
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

export default Disputes;
