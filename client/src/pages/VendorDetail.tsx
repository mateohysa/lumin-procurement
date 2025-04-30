
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Vendor, Document, Proposal } from "../types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Building,
  Calendar,
  FileText,
  Globe,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Save
} from "lucide-react";
import { toast } from "../hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedVendor, setEditedVendor] = useState<Partial<Vendor> | null>(null);

  const {
    data: vendor,
    isLoading: isLoadingVendor,
    error: vendorError,
    refetch: refetchVendor
  } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => api.vendors.getById(id as string),
  });

  const {
    data: vendorProposals,
    isLoading: isLoadingProposals
  } = useQuery({
    queryKey: ["vendorProposals", id],
    queryFn: () => api.proposals.getByVendorId(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (vendor) {
      setEditedVendor(vendor);
    }
  }, [vendor]);

  const isAdmin = user?.role === "admin";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedVendor((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (!editedVendor || !vendor) return;

    try {
      await api.vendors.update(vendor.id, editedVendor);
      setIsEditing(false);
      refetchVendor();
      toast({
        title: "Vendor updated",
        description: "The vendor information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating the vendor information.",
        variant: "destructive",
      });
    }
  };

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

  const getProposalStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      case "underEvaluation":
        return <Badge variant="default">Under Evaluation</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "awarded":
        return <Badge variant="success">Awarded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoadingVendor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p className="text-lg">Loading vendor details...</p>
      </div>
    );
  }

  if (vendorError || !vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Vendor not found</h2>
        <p className="text-gray-500 mb-4">The requested vendor could not be found.</p>
        <Button asChild>
          <Link to="/vendors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
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
            <Link to="/vendors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        {isAdmin && (
          <Button onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}>
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Vendor
              </>
            )}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                <div className="ml-3">{getStatusBadge(vendor.status)}</div>
              </div>
              <div className="text-gray-500 mt-1">
                {vendor.category?.join(", ")}
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span>{vendor.proposalsWon} / {vendor.proposalsSubmitted} proposals won</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
              <TabsTrigger value="overview" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Overview
              </TabsTrigger>
              <TabsTrigger value="proposals" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Proposals
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={editedVendor?.description || ""}
                      onChange={handleInputChange}
                      className="min-h-[150px] mb-4"
                    />
                  ) : (
                    <div className="prose max-w-none mb-6">
                      <p>{vendor.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                      {isEditing ? (
                        <Input
                          name="email"
                          type="email"
                          value={editedVendor?.email || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">{vendor.email}</a>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                      {isEditing ? (
                        <Input
                          name="phone"
                          value={editedVendor?.phone || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          {vendor.phone || "Not provided"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                      {isEditing ? (
                        <Input
                          name="website"
                          value={editedVendor?.website || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          {vendor.website ? (
                            <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {vendor.website.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Person</h4>
                      {isEditing ? (
                        <Input
                          name="contactPerson"
                          value={editedVendor?.contactPerson || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div>{vendor.contactPerson || "Not provided"}</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Registration Number</h4>
                      {isEditing ? (
                        <Input
                          name="registrationNumber"
                          value={editedVendor?.registrationNumber || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div>{vendor.registrationNumber || "Not provided"}</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Tax ID</h4>
                      {isEditing ? (
                        <Input
                          name="taxId"
                          value={editedVendor?.taxId || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div>{vendor.taxId || "Not provided"}</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                      <div>
                        {getStatusBadge(vendor.status)}
                        {vendor.verificationStatus === "verified" && (
                          <Badge variant="outline" className="ml-2">Verified</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {format(new Date(vendor.joinedDate), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Proposal Success Rate</div>
                      <div className="text-2xl font-bold">
                        {vendor.proposalsSubmitted > 0 
                          ? Math.round((vendor.proposalsWon / vendor.proposalsSubmitted) * 100)
                          : 0}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {vendor.proposalsWon} won out of {vendor.proposalsSubmitted} submitted
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Average Rating</div>
                      <div className="text-2xl font-bold">
                        {vendor.rating ? vendor.rating.toFixed(1) : "N/A"}
                      </div>
                      <div className="flex mt-1">
                        {vendor.rating && Array.from({length: 5}).map((_, i) => (
                          <span 
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(vendor.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</div>
                      <div className="text-2xl font-bold">
                        {vendor.totalContractValue 
                          ? `${vendor.totalContractValue.toLocaleString()} ${vendor.currency}` 
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Proposals</CardTitle>
                <CardDescription>
                  All proposals submitted by this vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProposals ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Loading proposals...</p>
                  </div>
                ) : vendorProposals && vendorProposals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tender</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorProposals.map((proposal: Proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell>
                            <Button variant="link" className="p-0" asChild>
                              <Link to={`/tenders/${proposal.tenderId}`}>
                                View Tender
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            {format(new Date(proposal.submittedAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {proposal.price.toLocaleString()} {proposal.currency}
                          </TableCell>
                          <TableCell>
                            {getProposalStatusBadge(proposal.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/proposals/${proposal.id}`)}
                            >
                              View Proposal
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No proposals submitted by this vendor yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Documents</CardTitle>
                <CardDescription>
                  Documents provided by this vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vendor.documents && vendor.documents.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.documents.map((doc: Document) => (
                      <div 
                        key={doc.id}
                        className="flex items-start justify-between p-4 border rounded-md"
                      >
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            {doc.description && (
                              <p className="text-sm text-gray-500">{doc.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border rounded-md text-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No documents available for this vendor.</p>
                    {isAdmin && isEditing && (
                      <Button variant="outline" className="mt-4">
                        Add Documents
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDetail;
