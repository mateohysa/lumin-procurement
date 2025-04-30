
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Proposal, Tender } from "../types";
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
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building,
  FileText,
  DollarSign,
  CalendarClock,
  Loader2,
} from "lucide-react";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "draft":
      return "outline";
    case "submitted":
      return "secondary";
    case "underEvaluation":
      return "default";
    case "rejected":
      return "destructive";
    case "accepted":
      return "success";
    case "awarded":
      return "success";
    default:
      return "outline";
  }
};

const ProposalList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tenderFilter, setTenderFilter] = useState("all");
  const [tenderMap, setTenderMap] = useState<{ [key: string]: Tender }>({});

  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["proposals"],
    queryFn: api.proposals.getAll,
  });

  const { data: tenders, isLoading: tendersLoading } = useQuery({
    queryKey: ["tenders"],
    queryFn: async () => {
      const data = await api.tenders.getAll();
      
      // Create a map of tenders by ID for quicker lookup
      const map: { [key: string]: Tender } = {};
      data.forEach((tender: Tender) => {
        map[tender.id] = tender;
      });
      
      setTenderMap(map);
      return data;
    },
  });

  const getFilteredProposals = () => {
    if (!proposals) return [];
    
    return proposals.filter((proposal: Proposal) => {
      const tenderTitle = tenderMap[proposal.tenderId]?.title || "";
      
      const matchesSearch = 
        tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || proposal.status === statusFilter;
      
      const matchesTender = 
        tenderFilter === "all" || proposal.tenderId === tenderFilter;
      
      return matchesSearch && matchesStatus && matchesTender;
    });
  };

  const isLoading = proposalsLoading || tendersLoading;
  const filteredProposals = getFilteredProposals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Proposals</h1>
          <p className="text-muted-foreground">
            Review submitted proposals for tenders
          </p>
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Filter Proposals</CardTitle>
          <CardDescription>
            Search by vendor, status, or tender
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vendor or tender..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="underEvaluation">Under Evaluation</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tenderFilter} onValueChange={setTenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenders</SelectItem>
                {tenders?.map((tender: Tender) => (
                  <SelectItem key={tender.id} value={tender.id}>
                    {tender.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading proposals...</span>
        </div>
      ) : (
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle>All Proposals</CardTitle>
            <CardDescription>
              {filteredProposals.length} proposals found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Tender</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal: Proposal) => {
                    const tender = tenderMap[proposal.tenderId];
                    
                    return (
                      <TableRow key={proposal.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-primary/10 rounded">
                              <Building className="h-4 w-4 text-primary" />
                            </div>
                            <div className="font-medium">{proposal.vendorName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tender ? (
                            <Link 
                              to={`/tenders/${tender.id}`}
                              className="text-primary hover:underline"
                            >
                              {tender.title}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">Unknown Tender</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(proposal.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span>{proposal.price.toLocaleString()} {proposal.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(proposal.status) as any}>
                            {proposal.status.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/proposals/${proposal.id}`}>
                              <FileText className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No proposals found</p>
                        {searchTerm || statusFilter !== "all" || tenderFilter !== "all" ? (
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                              setTenderFilter("all");
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

export default ProposalList;
