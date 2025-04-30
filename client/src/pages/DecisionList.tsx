
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Decision } from "../types";
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
  ArrowLeft,
  Award,
  Calendar,
  FileText,
  Plus,
  Search,
  XCircle,
  Clock
} from "lucide-react";

const DecisionList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isAdmin = user?.role === "admin";

  const { data: decisions, isLoading, error } = useQuery({
    queryKey: ["decisions"],
    queryFn: api.decisions.getAll,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "award":
        return <Award className="h-5 w-5 text-green-500" />;
      case "extension":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "cancellation":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredDecisions = decisions?.filter(
    (decision: Decision) =>
      decision.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (decision.winnerName && decision.winnerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading decisions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-red-500">Error loading decisions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tender Decisions</h1>
          <p className="text-gray-500">
            View and manage decisions for tenders
          </p>
        </div>

        {isAdmin && (
          <Button asChild>
            <Link to="/decisions/new">
              <Plus className="h-4 w-4 mr-2" />
              New Decision
            </Link>
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search decisions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Decisions</CardTitle>
          <CardDescription>
            {filteredDecisions?.length} decisions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Tender</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approvals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDecisions?.length > 0 ? (
                filteredDecisions.map((decision: Decision) => (
                  <TableRow key={decision.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(decision.type)}
                        <span className="capitalize">{decision.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{decision.tenderTitle}</div>
                      {decision.type === "award" && decision.winnerName && (
                        <div className="text-xs text-gray-500">
                          Awarded to: {decision.winnerName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{format(new Date(decision.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(decision.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {decision.approvals.filter(a => a.status === "approved").length} / {decision.approvals.length} approved
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/decisions/${decision.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="text-gray-500">
                      No decisions found. {searchTerm && "Try adjusting your search."}
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

export default DecisionList;
