
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Folder, CalendarClock, Award, FileCheck, PlusCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import TenderStatusCard from "../components/dashboard/TenderStatusCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import { Tender } from "../types";
import { api } from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const data = await api.tenders.getAll();
        setTenders(data);
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg font-medium loading-dots">Loading dashboard data</p>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isAdmin && (
          <Button asChild>
            <Link to="/tenders/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Tender
            </Link>
          </Button>
        )}
      </div>

      {!isVendor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TenderStatusCard
            tenders={tenders}
            status="published"
            icon={<Folder />}
            label="Active Tenders"
          />
          <TenderStatusCard
            tenders={tenders}
            status="evaluating"
            icon={<FileCheck />}
            label="Under Evaluation"
          />
          <TenderStatusCard
            tenders={tenders}
            status="awarded"
            icon={<Award />}
            label="Awarded"
          />
          <TenderStatusCard
            tenders={tenders}
            status="archived"
            icon={<CalendarClock />}
            label="Archived"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity tenders={tenders} />
        </div>
        <div>
          <UpcomingDeadlines tenders={tenders} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
