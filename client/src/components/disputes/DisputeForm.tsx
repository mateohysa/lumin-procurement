import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const disputeFormSchema = z.object({
  reason: z
    .string()
    .min(10, {
      message: 'Dispute reason must be at least 10 characters.',
    })
    .max(1000, {
      message: 'Dispute reason must not be longer than 1000 characters.',
    }),
});

type DisputeFormValues = z.infer<typeof disputeFormSchema>;

interface DisputeFormProps {
  tenderId: string;
  tenderTitle: string;
  winnerId?: string;
  winnerName?: string;
  disputeType?: 'rejection' | 'winner'; // Add dispute type to handle different scenarios
  onSuccess: () => void;
  onCancel: () => void;
}

export function DisputeForm({
  tenderId,
  tenderTitle,
  winnerId,
  winnerName,
  disputeType = 'winner',
  onSuccess,
  onCancel,
}: DisputeFormProps) {
  const { user } = useAuth();
  
  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (values: DisputeFormValues) => {
    try {
      // In a real app, this would be an API call
      console.log('Submitting dispute:', {
        tenderId,
        tenderTitle,
        winnerId,
        winnerName,
        vendorId: user?.id,
        vendorName: user?.name,
        reason: values.reason,
        status: 'pending',
        disputeType,
        createdAt: new Date().toISOString(),
      });
      
      // Save dispute locally so it appears in My Disputes and updates buttons
      try {
        const storageKey = 'localDisputes';
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existing.push({
          id: `local-${Date.now()}`,
          tenderId,
          tenderTitle,
          vendorId: user?.id,
          vendorName: user?.name,
          reason: values.reason,
          status: 'pending',
          disputeType,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(storageKey, JSON.stringify(existing));
        // Notify other components that local disputes have been updated
        window.dispatchEvent(new Event('localDisputesUpdated'));
      } catch {}
      
      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully and is pending review.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting dispute:', error);
      toast({
        title: "Error",
        description: "Failed to submit dispute. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dispute Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={disputeType === 'winner' 
                    ? "Please provide a detailed explanation for your dispute against the winner selection..." 
                    : "Please explain why you believe the rejection of your tender submission should be reconsidered..."}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {disputeType === 'winner'
                  ? "Clearly state why you believe the tender award decision should be reconsidered."
                  : "Provide specific reasons why you believe the rejection decision should be reviewed."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">
            Submit Dispute
          </Button>
        </div>
      </form>
    </Form>
  );
}
