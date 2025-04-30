
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tender } from "@/types";

interface TenderStatusCardProps {
  tenders: Tender[];
  status: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const TenderStatusCard: React.FC<TenderStatusCardProps> = ({
  tenders,
  status,
  icon,
  label,
  className
}) => {
  const count = tenders.filter(tender => tender.status === status).length;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-background p-2 rounded-full">
              {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenderStatusCard;
