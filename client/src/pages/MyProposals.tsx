
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Proposal, Tender } from "../types";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Search, 
  FileText,
  FilePlus,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";

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

const MyProposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tenders, setTenders] = useState<{ [key: string]: Tender }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all proposals for the current vendor
        const allProposals = await api.proposals.getAll();
        const vendorProposals = allProposals.filter(p => p.vendorId === user?.id);
        setProposals(vendorProposals);
        
        // Fetch tenders related to these proposals
        const tenderIds = [...new Set(vendorProposals.map(p => p.tenderId))];
        const tenderMap: { [key: string]: Tender } = {};
        
        for (const tenderId of tenderIds) {
          const tender = await api.tenders.getById(tenderId);
          if (tender) {
            tenderMap[tenderId] = tender;
          }
        }
        
        setTenders(tenderMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const filteredProposals = proposals.filter((proposal) => {
    const tenderTitle = tenders[proposal.tenderId]?.title || "";
    
    const matchesSearch = 
      tenderTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Proposals</h1>
        <Button asChild>
          <Link to="/tenders">
            <FilePlus className="h-4 w-4 mr-2" />
            Find Tenders to Apply
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by tender title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="underEvaluation">Under Evaluation</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading your proposals...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender Title</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal) => {
                    const tender = tenders[proposal.tenderId];
                    
                    return (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">
                          <Link 
                            to={`/tenders/${proposal.tenderId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {tender?.title || "Unknown Tender"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {format(new Date(proposal.submittedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {proposal.price.toLocaleString()} {proposal.currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(proposal.status) as any}>
                            {proposal.status.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" asChild>
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center p-6">
                        <p className="text-gray-500 mb-4">You haven't submitted any proposals yet.</p>
                        <Button asChild>
                          <Link to="/tenders">Browse Available Tenders</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposals;
