
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileWarning, AlertCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Alert = {
  id: string;
  icon: React.ReactNode;
  message: string;
  type: 'deadline' | 'document' | 'evaluation' | 'verification';
  badge: string;
  badgeColor: string;
  action?: string;
};

export function LiveAlerts() {
  // In a real app, these would come from an API
  const alerts: Alert[] = [
    {
      id: "alert-1",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      message: "3 tenders approaching deadline in 3 days",
      type: "deadline",
      badge: "DUE SOON",
      badgeColor: "bg-amber-100 text-amber-800",
      action: "View Tenders"
    },
    {
      id: "alert-2",
      icon: <FileWarning className="h-5 w-5 text-red-500" />,
      message: "2 vendors missing required documents for IT Infrastructure tender",
      type: "document",
      badge: "MISSING FILES",
      badgeColor: "bg-red-100 text-red-800",
      action: "Send Reminder"
    },
    {
      id: "alert-3",
      icon: <AlertCircle className="h-5 w-5 text-purple-500" />,
      message: "1 evaluation flagged by AI for irregular scoring patterns",
      type: "evaluation",
      badge: "AI FLAG",
      badgeColor: "bg-purple-100 text-purple-800",
      action: "Review"
    },
    {
      id: "alert-4",
      icon: <UserCheck className="h-5 w-5 text-blue-500" />,
      message: "4 new vendors awaiting verification before they can submit",
      type: "verification",
      badge: "ACTION REQUIRED",
      badgeColor: "bg-blue-100 text-blue-800",
      action: "Verify Now"
    }
  ];

  const handleDismiss = (id: string) => {
    console.log(`Dismissed alert: ${id}`);
    // In a real app, you would remove the alert from state/backend
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
          Live Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-muted"
            >
              <div className="mt-0.5">{alert.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${alert.badgeColor}`}>
                    {alert.badge}
                  </span>
                </div>
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2">
                {alert.action && (
                  <Button variant="outline" size="sm" className="h-8">
                    {alert.action}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => handleDismiss(alert.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
