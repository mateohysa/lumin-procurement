
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Dispute } from '@/components/disputes/DisputesList';

interface DisputeDetailProps {
  dispute: Dispute | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (disputeId: string, status: 'rejected' | 'accepted', response: string) => void;
}

export function DisputeDetail({ dispute, isOpen, onClose, onStatusChange }: DisputeDetailProps) {
  const { user } = useAuth();
  const [response, setResponse] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  // Reset response when dispute changes
  React.useEffect(() => {
    setResponse('');
  }, [dispute]);

  if (!dispute) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (status: 'rejected' | 'accepted') => {
    if (!dispute || !onStatusChange) return;
    
    if (!response.trim() && status === 'rejected') {
      toast({
        title: "Response required",
        description: "Please provide a response explaining your decision.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onStatusChange(dispute.id, status, response);
      toast({
        title: `Dispute ${status}`,
        description: `The dispute has been ${status} successfully.`
      });
      onClose();
    } catch (error) {
      console.error(`Error ${status} dispute:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} dispute. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dispute Details</DialogTitle>
          <DialogDescription>
            Review the dispute information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge
              className={
                dispute.status === 'pending' ? "bg-amber-100 text-amber-800" :
                dispute.status === 'rejected' ? "bg-red-100 text-red-800" :
                "bg-green-100 text-green-800"
              }
            >
              {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
            </Badge>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Tender</div>
            <div className="font-medium">{dispute.tenderTitle}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Filed By</div>
            <div className="font-medium">{dispute.vendorName}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Date Filed</div>
            <div>{formatDate(dispute.createdAt)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Reason for Dispute</div>
            <div className="bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">{dispute.reason}</div>
          </div>
          
          {dispute.responseText && (
            <div>
              <div className="text-sm text-muted-foreground">Admin Response</div>
              <div className="bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">{dispute.responseText}</div>
            </div>
          )}
          
          {dispute.resolvedAt && (
            <div>
              <div className="text-sm text-muted-foreground">Resolved On</div>
              <div>{formatDate(dispute.resolvedAt)}</div>
            </div>
          )}
          
          {isAdmin && dispute.status === 'pending' && (
            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Your Response</div>
              <Textarea 
                placeholder="Provide your response to this dispute..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isSubmitting}
                >
                  Reject Dispute
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleStatusChange('accepted')}
                  disabled={isSubmitting}
                >
                  Accept & Change Winner
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
