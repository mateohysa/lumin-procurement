import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Briefcase, Trophy, Calendar, Percent } from 'lucide-react';

export function VendorStatCards() {
  // TODO: Replace mock values with real API data
  const stats = [
    {
      title: "Active Proposals",
      value: "2",
      icon: <Briefcase />, 
      color: "bg-green-50 text-green-700", 
      link: "/available-tenders"
    },
    {
      title: "Won Tenders",
      value: "3",
      icon: <Trophy />, 
      color: "bg-amber-50 text-amber-700", 
      link: "/my-submissions"
    },
    {
      title: "Submitted This Month",
      value: "5",
      icon: <Calendar />, 
      color: "bg-blue-50 text-blue-700", 
      link: "/my-submissions"
    },
    {
      title: "Success Rate",
      value: "60%",
      icon: <Percent />, 
      color: "bg-indigo-50 text-indigo-700", 
      link: "/reports"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          link={stat.link}
        />
      ))}
    </div>
  );
} 