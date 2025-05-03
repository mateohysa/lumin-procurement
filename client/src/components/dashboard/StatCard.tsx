
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  change?: string;
  color?: string;
  link?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, className, trend, change, color, link }: StatCardProps) {
  const CardWrapper = link ? Link : React.Fragment;
  const wrapperProps = link ? { to: link, className: "block" } : {};

  return (
    <CardWrapper {...wrapperProps}>
      <Card className={cn("card-hover", className)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{title}</div>
              <div className="text-3xl font-bold mt-1">{value}</div>
              {change && (
                <div className="text-sm text-muted-foreground mt-1">{change}</div>
              )}
              {trend && (
                <div className={`flex items-center text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.positive ? (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                  {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
                </div>
              )}
            </div>
            <div className={`p-2 rounded-full ${color || 'bg-primary/10'}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
