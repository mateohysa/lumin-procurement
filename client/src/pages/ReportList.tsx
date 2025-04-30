
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Report } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  BarChart3,
  Calendar,
  FileText,
  Plus,
  Search,
  User
} from "lucide-react";

const ReportList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isAdmin = user?.role === "admin";
  const isEvaluator = user?.role === "evaluator";

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: api.reports.getAll,
  });

  const filteredReports = reports?.filter((report: Report) => {
    // Check permissions first
    if (!report.permissions.includes(user?.role || "")) {
      return false;
    }
    
    // Then filter by search term
    return (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "procurement":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "vendor":
        return <User className="h-5 w-5 text-green-500" />;
      case "compliance":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "financial":
        return <BarChart3 className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "published":
        return <Badge variant="secondary">Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-red-500">Error loading reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reports</h1>
          <p className="text-gray-500">
            View and generate procurement reports
          </p>
        </div>

        {isAdmin && (
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link to="/reports/generate">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Link>
            </Button>
            <Button asChild>
              <Link to="/reports/new">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            {filteredReports?.length} reports found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports?.length > 0 ? (
                filteredReports.map((report: Report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-xs text-gray-500">
                        {report.description.length > 60
                          ? `${report.description.substring(0, 60)}...`
                          : report.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{format(new Date(report.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        by {report.createdBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(report.lastUpdated), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="text-gray-500">
                      No reports found. {searchTerm && "Try adjusting your search."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportList;
