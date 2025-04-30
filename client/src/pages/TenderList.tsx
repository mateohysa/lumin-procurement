
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Tender } from "../types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import {
  Plus,
  Search,
  Folder,
  CalendarClock,
  Clock,
  User,
  FileText,
  Loader2
} from "lucide-react";

const TenderList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";

  const { data: tenders, isLoading } = useQuery({
    queryKey: ["tenders"],
    queryFn: api.tenders.getAll,
  });

  const getFilteredTenders = () => {
    if (!tenders) return [];
    
    return tenders.filter((tender: Tender) => {
      const matchesSearch = 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "all" || tender.category === categoryFilter;
      
      const matchesStatus = 
        statusFilter === "all" || tender.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "evaluating":
        return <Badge variant="secondary">Evaluating</Badge>;
      case "awarded":
        return <Badge variant="success">Awarded</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTenderTypeIcon = (type: string) => {
    switch (type) {
      case "RFP":
        return <FileText className="h-4 w-4 text-primary" />;
      case "RFQ":
        return <Folder className="h-4 w-4 text-primary" />;
      case "RFI":
        return <User className="h-4 w-4 text-primary" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const filteredTenders = getFilteredTenders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tenders</h1>
          <p className="text-muted-foreground">
            Browse and manage all procurement tenders
          </p>
        </div>
        
        {isAdmin && (
          <Button asChild>
            <Link to="/tenders/new">
              <Plus className="h-4 w-4 mr-2" />
              New Tender
            </Link>
          </Button>
        )}
      </div>

      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Filter Tenders</CardTitle>
          <CardDescription>
            Find tenders by title, category, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="IT Services">IT Services</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="evaluating">Evaluating</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading tenders...</span>
        </div>
      ) : (
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle>All Tenders</CardTitle>
            <CardDescription>
              {filteredTenders.length} tenders found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenders.length > 0 ? (
                  filteredTenders.map((tender: Tender) => (
                    <TableRow key={tender.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-primary/10 rounded">
                            {getTenderTypeIcon(tender.type)}
                          </div>
                          <div>
                            <div className="font-medium">{tender.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {tender.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{tender.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {new Date(tender.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tender.status)}</TableCell>
                      <TableCell className="text-right">
                        {isVendor && tender.status === "published" ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/tenders/${tender.id}/apply`}>Apply</Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/tenders/${tender.id}`}>View Details</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No tenders found</p>
                        {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? (
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => {
                              setSearchTerm("");
                              setCategoryFilter("all");
                              setStatusFilter("all");
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenderList;
