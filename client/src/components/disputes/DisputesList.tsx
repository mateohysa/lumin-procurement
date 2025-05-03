
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, Clock, Calendar } from 'lucide-react';

export interface Dispute {
  id: string;
  tenderId: string;
  tenderTitle: string;
  vendorId: string;
  vendorName: string;
  reason: string;
  status: 'pending' | 'rejected' | 'accepted';
  createdAt: string;
  responseText?: string;
  resolvedAt?: string;
}

interface DisputesListProps {
  disputes: Dispute[];
  isAdmin?: boolean;
  onViewDispute: (dispute: Dispute) => void;
}

export function DisputesList({ disputes, isAdmin = false, onViewDispute }: DisputesListProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {disputes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <Flag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-2 text-lg font-medium">No disputes found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isAdmin 
                  ? "There are no disputes to review at this time."
                  : "You haven't filed any disputes yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        disputes.map((dispute) => (
          <Card key={dispute.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    {isAdmin ? `Dispute from ${dispute.vendorName}` : `Dispute for ${dispute.tenderTitle}`}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Filed on {formatDate(dispute.createdAt)}</span>
                  </div>
                </div>
                {renderStatusBadge(dispute.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm line-clamp-2 mb-4">
                {dispute.reason}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDispute(dispute)}
                >
                  {isAdmin ? "Review Dispute" : "View Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
