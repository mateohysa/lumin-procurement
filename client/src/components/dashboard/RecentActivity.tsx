
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tender } from "@/types";
import { Calendar, FileText, User } from "lucide-react";

interface RecentActivityProps {
  tenders: Tender[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ tenders }) => {
  // Get last 5 tenders sorted by date
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "evaluating":
        return "secondary";
      case "awarded":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {recentTenders.length > 0 ? (
            recentTenders.map((tender) => (
              <div key={tender.id} className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {tender.type === "RFP" ? (
                    <FileText className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{tender.title}</p>
                    <Badge variant={getStatusBadgeVariant(tender.status)}>
                      {tender.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tender.description.substring(0, 80)}...</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(tender.updatedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
