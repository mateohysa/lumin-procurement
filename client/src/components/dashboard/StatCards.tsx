
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { File, Users, Briefcase, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export function StatCards() {
  // In a real application, these would come from API calls
  const stats = [
    {
      title: "Total Tenders",
      value: "24",
      change: "+3 this month",
      icon: <File />,
      color: "bg-blue-50 text-blue-700",
      link: "/create-tender"
    },
    {
      title: "Total Submissions",
      value: "86",
      change: "+12 this week",
      icon: <Briefcase />,
      color: "bg-green-50 text-green-700",
      link: "/submissions"
    },
    {
      title: "Active Vendors",
      value: "42",
      change: "5 pending verification",
      icon: <Users />,
      color: "bg-amber-50 text-amber-700",
      link: "/vendors"
    },
    {
      title: "Evaluations",
      value: "68%",
      change: "18/24 completed",
      icon: <CheckCircle />,
      color: "bg-indigo-50 text-indigo-700",
      link: "/evaluations"
    },
    {
      title: "AI Issues",
      value: "7",
      change: "3 critical",
      icon: <AlertTriangle />,
      color: "bg-red-50 text-red-700",
      link: "/reports"
    },
    {
      title: "Unverified Vendors",
      value: "8",
      change: "Action needed",
      icon: <ShieldAlert />,
      color: "bg-purple-50 text-purple-700",
      link: "/vendors"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          link={stat.link}
        />
      ))}
    </div>
  );
}
