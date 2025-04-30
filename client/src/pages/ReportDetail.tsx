
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Report, ReportChart, ReportTable } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from "recharts";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Download,
  Loader2,
  Printer,
  Share2,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: report,
    isLoading,
    error
  } = useQuery({
    queryKey: ["report", id],
    queryFn: () => api.reports.getById(id as string),
  });

  const renderChart = (chart: ReportChart) => {
    switch (chart.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p className="text-lg">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Report not found</h2>
        <p className="text-gray-500 mb-4">The requested report could not be found.</p>
        <Button asChild>
          <Link to="/reports">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/reports">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <Badge variant={report.status === "published" ? "secondary" : "outline"}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Email Report</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
              <DropdownMenuItem>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold capitalize">{report.title}</h1>
          <div className="text-gray-500 mt-1">{report.description}</div>
          <div className="flex mt-4 text-sm text-gray-500">
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-1" />
              Generated: {format(new Date(report.createdAt), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              By: {report.createdBy}
            </div>
          </div>
        </div>

        {report.data.summary && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.data.summary.totalTenders !== undefined && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Total Tenders</div>
                    <div className="text-2xl font-bold mt-1">{report.data.summary.totalTenders}</div>
                  </CardContent>
                </Card>
              )}
              {report.data.summary.totalValue !== undefined && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Total Value</div>
                    <div className="text-2xl font-bold mt-1">
                      {report.data.summary.totalValue.toLocaleString()} {report.data.summary.currency}
                    </div>
                  </CardContent>
                </Card>
              )}
              {report.data.summary.avgProposalsPerTender !== undefined && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Avg. Proposals per Tender</div>
                    <div className="text-2xl font-bold mt-1">{report.data.summary.avgProposalsPerTender}</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {report.data.summary.highlights && report.data.summary.highlights.length > 0 && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.data.summary.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {report.data.charts && report.data.charts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Charts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {report.data.charts.map((chart) => (
                <Card key={chart.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{chart.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderChart(chart)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {report.data.tables && report.data.tables.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Tables</h2>
            <div className="space-y-6">
              {report.data.tables.map((table: ReportTable) => (
                <Card key={table.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{table.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {table.headers.map((header, index) => (
                              <TableHead key={index}>{header}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
