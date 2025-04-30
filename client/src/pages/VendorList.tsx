
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Vendor } from "../types";
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
  Building,
  Mail,
  Phone,
  Plus,
  Search,
  BarChart3
} from "lucide-react";

const VendorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isAdmin = user?.role === "admin";

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ["vendors"],
    queryFn: api.vendors.getAll,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "blacklisted":
        return <Badge variant="destructive">Blacklisted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredVendors = vendors?.filter(
    (vendor: Vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.category && vendor.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading vendors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-red-500">Error loading vendors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Vendors</h1>
          <p className="text-gray-500">
            View and manage vendor information
          </p>
        </div>

        {isAdmin && (
          <Button asChild>
            <Link to="/vendors/new">
              <Plus className="h-4 w-4 mr-2" />
              New Vendor
            </Link>
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search vendors..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            {filteredVendors?.length} vendors found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors?.length > 0 ? (
                filteredVendors.map((vendor: Vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-xs text-gray-500">
                        Since {format(new Date(vendor.joinedDate), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs">
                          <Mail className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {vendor.email}
                        </div>
                        {vendor.phone && (
                          <div className="flex items-center text-xs">
                            <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            {vendor.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vendor.category?.map((cat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vendor.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Proposals: {vendor.proposalsWon} / {vendor.proposalsSubmitted}</div>
                        <div className="flex items-center">
                          <BarChart3 className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {vendor.rating && (
                            <span>{vendor.rating.toFixed(1)} / 5.0</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/vendors/${vendor.id}`)}
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
                      No vendors found. {searchTerm && "Try adjusting your search."}
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

export default VendorList;
