
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardChartsProps {
  timeFilter: string;
}

// Sample data for tender activity
const tenderActivityData = {
  '7days': [
    { name: 'Apr 25', tenders: 4, submissions: 7, evaluations: 3 },
    { name: 'Apr 26', tenders: 1, submissions: 5, evaluations: 4 },
    { name: 'Apr 27', tenders: 2, submissions: 3, evaluations: 2 },
    { name: 'Apr 28', tenders: 0, submissions: 5, evaluations: 1 },
    { name: 'Apr 29', tenders: 3, submissions: 8, evaluations: 5 },
    { name: 'Apr 30', tenders: 2, submissions: 4, evaluations: 2 },
    { name: 'May 1', tenders: 1, submissions: 6, evaluations: 3 },
  ],
  '30days': [
    // Additional data would be here
  ],
  'today': [
    { name: '8AM', tenders: 0, submissions: 1, evaluations: 0 },
    { name: '10AM', tenders: 1, submissions: 0, evaluations: 0 },
    { name: '12PM', tenders: 0, submissions: 2, evaluations: 1 },
    { name: '2PM', tenders: 0, submissions: 1, evaluations: 0 },
    { name: '4PM', tenders: 0, submissions: 1, evaluations: 2 },
  ]
};

// Sample data for submission categories
const submissionCategoriesData = [
  { name: 'IT Services', value: 12, color: '#3b82f6' },
  { name: 'Equipment', value: 8, color: '#10b981' },
  { name: 'Construction', value: 5, color: '#f97316' },
  { name: 'Consulting', value: 10, color: '#8b5cf6' },
  { name: 'Marketing', value: 7, color: '#ec4899' }
];

export function DashboardCharts({ timeFilter }: DashboardChartsProps) {
  const activityData = tenderActivityData[timeFilter as keyof typeof tenderActivityData] || tenderActivityData['7days'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Procurement Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity">
          <TabsList className="mb-4">
            <TabsTrigger value="activity">Tender Activity</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="h-[300px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tenders" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="evaluations" 
                  stroke="#f97316" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories" className="h-[300px] mt-0">
            <div className="flex h-full">
              <div className="w-2/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={submissionCategoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {submissionCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-1/3 flex flex-col justify-center space-y-2">
                {submissionCategoriesData.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <span className="text-sm">{category.name}: {category.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
