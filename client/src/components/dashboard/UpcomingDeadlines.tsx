
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tender } from "@/types";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingDeadlinesProps {
  tenders: Tender[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ tenders }) => {
  // Get tenders with upcoming deadlines
  const today = new Date();
  const upcomingTenders = tenders
    .filter(tender => {
      const deadline = new Date(tender.deadline);
      return deadline > today && tender.status === "published";
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (days: number) => {
    if (days <= 3) return "text-destructive";
    if (days <= 7) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTenders.length > 0 ? (
            upcomingTenders.map((tender) => {
              const daysRemaining = getDaysRemaining(tender.deadline);
              return (
                <div key={tender.id} className="flex items-center space-x-4 p-3 rounded-md bg-background">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tender.title}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(tender.deadline).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className={cn("text-sm font-medium", getDeadlineColor(daysRemaining))}>
                    {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-6">No upcoming deadlines</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
