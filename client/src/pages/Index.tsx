import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { StatCards } from '@/components/dashboard/StatCards';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { AiInsights } from '@/components/dashboard/AiInsights';
import { VendorStatCards } from '@/components/dashboard/VendorStatCards';
import { RecentTenders } from '@/components/dashboard/RecentTenders';
import { LiveAlerts } from '@/components/dashboard/LiveAlerts';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProcurementTimeline } from '@/components/dashboard/ProcurementTimeline';
import { EvaluationProgress } from '@/components/dashboard/EvaluationProgress';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('7days');
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-specific dashboards
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard timeFilter={timeFilter} />;
      case 'vendor':
        return <VendorDashboard timeFilter={timeFilter} />;
      case 'evaluator':
        return <EvaluatorDashboard timeFilter={timeFilter} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <MainLayout>
      <DashboardFilters />
      {renderDashboard()}
    </MainLayout>
  );
};

// Admin Dashboard
const AdminDashboard = ({ timeFilter }: { timeFilter: string }) => {
  return (
    <div className="space-y-6">
      <StatCards />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <DashboardCharts timeFilter={timeFilter} />
        </div>
        <div className="space-y-6">
          <AiInsights />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTenders />
        </div>
        <div>
          <ProcurementTimeline />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <LiveAlerts />
        <ActivityFeed />
      </div>
    </div>
  );
};

// Vendor Dashboard
const VendorDashboard = ({ timeFilter }: { timeFilter: string }) => {
  return (
    <div className="space-y-6">
      {/* Vendor KPI overview */}
      <VendorStatCards />
      {/* Recent Activity and AI Insights side by side */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* these cards can be extracted to a component if needed */}
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <h3 className="font-medium text-green-800">Recent Success!</h3>
              <p className="text-sm mt-1">Your proposal for "Annual Office Supplies" has been approved.</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-blue-800">New Opportunity</h3>
              <p className="text-sm mt-1">A new tender "IT Infrastructure Upgrade" matches your profile.</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h3 className="font-medium text-yellow-800">Deadline Approaching</h3>
              <p className="text-sm mt-1">"Office Furniture Procurement" closes in 3 days.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border-blue-100">
          <AiInsights />
        </div>
      </div>
      {/* Recommended tenders */}
      <div>
        <RecentTenders />
      </div>
    </div>
  );
};

// Evaluator Dashboard
const EvaluatorDashboard = ({ timeFilter }: { timeFilter: string }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">My Evaluation Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="text-sm text-muted-foreground">Assigned Tenders</div>
              <div className="font-medium">2</div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="text-sm text-muted-foreground">Due This Week</div>
              <div className="font-medium text-red-600">1</div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="text-sm text-muted-foreground">Completed This Month</div>
              <div className="font-medium">3</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="font-medium">90%</div>
            </div>
          </div>
        </div>
        <EvaluationProgress />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ActivityFeed />
        </div>
        <div>
          <AiInsights />
        </div>
      </div>
    </div>
  );
};

export default Index;

