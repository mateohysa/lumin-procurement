
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DisputeForm } from './DisputeForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DisputeButtonProps {
  tenderId: string;
  tenderTitle: string;
  winnerId?: string;
  winnerName?: string;
  tenderEndDate: string;
  disputeTimeFrameDays: number;
  disputeType?: 'rejection' | 'winner';
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DisputeButton({
  tenderId,
  tenderTitle,
  winnerId,
  winnerName,
  tenderEndDate,
  disputeTimeFrameDays = 7,
  disputeType = 'winner',
  variant = 'outline',
  size = 'sm'
}: DisputeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate if we're still within the dispute window
  const canFileDispute = () => {
    const tenderEnd = new Date(tenderEndDate);
    const disputeDeadline = new Date(tenderEnd);
    disputeDeadline.setDate(disputeDeadline.getDate() + disputeTimeFrameDays);
    
    return new Date() <= disputeDeadline;
  };
  
  const isWithinTimeFrame = canFileDispute();
  
  // Calculate days left for filing disputes
  const getDaysLeft = () => {
    const tenderEnd = new Date(tenderEndDate);
    const disputeDeadline = new Date(tenderEnd);
    disputeDeadline.setDate(disputeDeadline.getDate() + disputeTimeFrameDays);
    
    const now = new Date();
    const daysDiff = Math.ceil((disputeDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysDiff);
  };

  const buttonText = disputeType === 'winner' ? 'File Dispute' : 'Dispute Rejection';

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant={variant}
                size={size}
                onClick={() => setIsDialogOpen(true)}
                disabled={!isWithinTimeFrame}
                className="flex items-center gap-2"
              >
                <Flag className="h-4 w-4" />
                {buttonText}
                {isWithinTimeFrame && getDaysLeft() <= 3 && (
                  <span className="text-xs text-red-500 font-medium">{getDaysLeft()} days left</span>
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {!isWithinTimeFrame && (
            <TooltipContent>
              <p>The {disputeTimeFrameDays}-day window for filing {disputeType === 'winner' ? 'winner disputes' : 'rejection disputes'} has expired</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {disputeType === 'winner' ? 'File a Dispute Against Winner Selection' : 'Dispute Submission Rejection'}
            </DialogTitle>
            <DialogDescription>
              {isWithinTimeFrame ? (
                <>
                  You have {getDaysLeft()} days left to file a dispute 
                  {disputeType === 'winner' 
                    ? ' against the winner selection for this tender.' 
                    : ' against the rejection of your submission.'}
                  Please provide a detailed explanation for your dispute.
                </>
              ) : (
                <>
                  The {disputeTimeFrameDays}-day window for filing disputes for this tender has expired.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {isWithinTimeFrame ? (
            <>
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Disputes must be filed within {disputeTimeFrameDays} days of the decision date.
                  You have {getDaysLeft()} day(s) remaining.
                </AlertDescription>
              </Alert>
              <DisputeForm
                tenderId={tenderId}
                tenderTitle={tenderTitle}
                winnerId={winnerId}
                winnerName={winnerName}
                disputeType={disputeType}
                onSuccess={() => setIsDialogOpen(false)}
                onCancel={() => setIsDialogOpen(false)}
              />
            </>
          ) : (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
