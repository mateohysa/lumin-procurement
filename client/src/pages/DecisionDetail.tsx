
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Decision, Document, Approval } from "../types";
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
  Building,
  Calendar,
  Check,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Pencil,
  Save,
  User,
  XCircle
} from "lucide-react";
import { toast } from "../hooks/use-toast";

const DecisionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDecision, setEditedDecision] = useState<Partial<Decision> | null>(null);

  const {
    data: decision,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["decision", id],
    queryFn: () => api.decisions.getById(id as string),
  });

  useEffect(() => {
    if (decision) {
      setEditedDecision(decision);
    }
  }, [decision]);

  const isAdmin = user?.role === "admin";
  const isPending = decision?.status === "pending";
  const canEdit = isAdmin && isPending;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDecision((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (!editedDecision || !decision) return;

    try {
      await api.decisions.update(decision.id, editedDecision);
      setIsEditing(false);
      refetch();
      toast({
        title: "Decision updated",
        description: "The decision has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating the decision.",
        variant: "destructive",
      });
    }
  };

  const handleApproval = async (status: "approved" | "rejected") => {
    if (!decision) return;

    const approval: Approval = {
      userId: user?.id || "",
      userName: user?.name || "",
      status,
      comment: "",
      timestamp: new Date().toISOString(),
    };

    try {
      await api.decisions.addApproval(decision.id, approval);
      refetch();
      toast({
        title: status === "approved" ? "Decision approved" : "Decision rejected",
        description: `You have ${status} this decision.`,
      });
    } catch (error) {
      toast({
        title: "Action failed",
        description: `There was an error ${status === "approved" ? "approving" : "rejecting"} this decision.`,
        variant: "destructive",
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p className="text-lg">Loading decision details...</p>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Decision not found</h2>
        <p className="text-gray-500 mb-4">The requested decision could not be found.</p>
        <Button asChild>
          <Link to="/decisions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decisions
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
            <Link to="/decisions">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex items-center space-x-2 ml-4">
            {getTypeIcon(decision.type)}
            <h1 className="text-xl font-bold capitalize">{decision.type} Decision</h1>
          </div>
          {getStatusBadge(decision.status)}
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}>
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Decision
                </>
              )}
            </Button>
          )}

          {isAdmin && isPending && !isEditing && (
            <>
              <Button variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200" onClick={() => handleApproval("rejected")}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200" onClick={() => handleApproval("approved")}>
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
              <TabsTrigger value="overview" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Overview
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Documents
              </TabsTrigger>
              <TabsTrigger value="approvals" className="rounded-none px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Approvals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Decision Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tender</label>
                        {isEditing ? (
                          <Input
                            name="tenderTitle"
                            value={editedDecision?.tenderTitle || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center">
                            <Button variant="link" className="p-0" asChild>
                              <Link to={`/tenders/${decision.tenderId}`}>{decision.tenderTitle}</Link>
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Decision Type</label>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(decision.type)}
                          <span className="capitalize">{decision.type}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {format(new Date(decision.createdAt), "MMMM d, yyyy")}
                        </div>
                      </div>

                      {decision.effectiveDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {format(new Date(decision.effectiveDate), "MMMM d, yyyy")}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {decision.type === "award" && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Award Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
                          {isEditing ? (
                            <Input
                              name="winnerName"
                              value={editedDecision?.winnerName || ""}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-gray-500" />
                              {decision.winnerName || "N/A"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Input
                                name="contractValue"
                                type="number"
                                value={editedDecision?.contractValue || ""}
                                onChange={handleInputChange}
                                className="w-2/3"
                              />
                              <Input
                                name="currency"
                                value={editedDecision?.currency || ""}
                                onChange={handleInputChange}
                                className="w-1/3"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                              {decision.contractValue?.toLocaleString()} {decision.currency}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={editedDecision?.description || ""}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <div className="prose max-w-none">
                      <p>{decision.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Documents</CardTitle>
                <CardDescription>
                  Documents related to this decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                {decision.documents && decision.documents.length > 0 ? (
                  <div className="space-y-4">
                    {decision.documents.map((doc: Document) => (
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
                    <p className="text-gray-500">No documents attached to this decision.</p>
                    {isAdmin && isPending && (
                      <Button variant="outline" className="mt-4">
                        Add Documents
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Status</CardTitle>
                <CardDescription>
                  Current approval status for this decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                {decision.approvals && decision.approvals.length > 0 ? (
                  <div className="space-y-4">
                    {decision.approvals.map((approval: Approval, index: number) => (
                      <div 
                        key={index}
                        className="flex items-start justify-between p-4 border rounded-md"
                      >
                        <div className="flex items-start">
                          <User className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                          <div>
                            <h4 className="font-medium">{approval.userName}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {approval.timestamp ? format(new Date(approval.timestamp), "MMM d, yyyy, h:mm a") : "Pending"}
                            </p>
                            {approval.comment && (
                              <p className="text-sm text-gray-600 mt-2 border-l-2 border-gray-200 pl-2">
                                {approval.comment}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          {approval.status === "approved" ? (
                            <Badge variant="success">Approved</Badge>
                          ) : approval.status === "rejected" ? (
                            <Badge variant="destructive">Rejected</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border rounded-md text-center">
                    <User className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">No approvals recorded for this decision yet.</p>
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

export default DecisionDetail;
