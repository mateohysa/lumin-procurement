import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Proposal, Tender, EvaluationScore } from "../types";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  DollarSign,
  Clock,
  ClipboardCheck,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Pencil,
  Save
} from "lucide-react";
import { format } from "date-fns";

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
      return "default";
    case "awarded":
      return "default";
    default:
      return "outline";
  }
};

const ProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProposal, setEditedProposal] = useState<Partial<Proposal> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          setLoading(true);
          const proposalData = await api.proposals.getById(id);
          setProposal(proposalData);
          setEditedProposal(proposalData);

          if (proposalData) {
            const tenderData = await api.tenders.getById(proposalData.tenderId);
            setTender(tenderData);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching proposal data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isAdmin = user?.role === "admin";
  const isEvaluator = user?.role === "evaluator";
  const isAdminOrEvaluator = isAdmin || isEvaluator;
  const isVendor = user?.role === "vendor";

  // Check if vendor is the owner of this proposal
  const isProposalOwner = isVendor && proposal && user?.id === proposal.vendorId;
  const canEditProposal = (isProposalOwner || isAdmin) && proposal?.status !== "awarded" && proposal?.status !== "accepted";

  const handleEditToggle = () => {
    if (isEditing && editedProposal) {
      // Save changes
      handleSaveProposal();
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleSaveProposal = async () => {
    if (!editedProposal || !proposal) return;
    
    try {
      // In a real app, this would be an API call to update the proposal
      console.log("Saving proposal changes:", editedProposal);
      
      // Mock API call
      const updatedProposal = await api.proposals.update(proposal.id, editedProposal);
      setProposal(updatedProposal);
      setIsEditing(false);
      
      // Show success toast
      // toast({
      //   title: "Proposal updated",
      //   description: "The proposal has been updated successfully.",
      // });
    } catch (error) {
      console.error("Error updating proposal:", error);
      // Show error toast
      // toast({
      //   title: "Error",
      //   description: "Failed to update proposal. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProposal(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setEditedProposal(prev => prev ? { ...prev, [name]: numValue } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading proposal details...</span>
      </div>
    );
  }

  if (!proposal || !tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Proposal not found</h2>
        <p className="text-gray-500 mb-4">The requested proposal could not be found or you don't have permission to view it.</p>
        <Button asChild>
          <Link to="/proposals">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Proposals
          </Link>
        </Button>
      </div>
    );
  }

  // Access control check
  if (isVendor && !isProposalOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-4">You don't have permission to view this proposal.</p>
        <Button asChild>
          <Link to="/my-proposals">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Proposals
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
            <Link to={isVendor ? "/my-proposals" : "/proposals"}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <Badge variant={getStatusBadgeVariant(proposal.status) as any} className="ml-2">
            {proposal.status.replace(/([A-Z])/g, ' $1').trim()}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {canEditProposal && (
            <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"}>
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Proposal
                </>
              )}
            </Button>
          )}
          
          {isAdminOrEvaluator && proposal.status === "underEvaluation" && (
            <Button variant="outline" asChild>
              <Link to={`/proposals/${proposal.id}/evaluate`}>
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Evaluate
              </Link>
            </Button>
          )}
          
          {isAdmin && proposal.status === "underEvaluation" && (
            <>
              <Button variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-1">
            Proposal for: {tender.title}
          </h2>
          <p className="text-gray-500 text-sm mb-3">
            {isEditing ? (
              <input
                type="text"
                name="vendorName"
                value={editedProposal?.vendorName || ''}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            ) : (
              <>Submitted by {proposal.vendorName}</>
            )}
          </p>
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Submitted: {format(new Date(proposal.submittedAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {isEditing ? (
                <div className="flex items-center">
                  <span>Proposed Amount: </span>
                  <input
                    type="number"
                    name="price"
                    value={editedProposal?.price || 0}
                    onChange={handleNumberChange}
                    className="w-32 mx-1 border border-gray-300 rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    name="currency"
                    value={editedProposal?.currency || ''}
                    onChange={handleInputChange}
                    className="w-16 border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ) : (
                <span>Proposed Amount: {proposal.price.toLocaleString()} {proposal.currency}</span>
              )}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 pl-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {isAdminOrEvaluator && (
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger value="decision">Decision</TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Building className="h-4 w-4 mr-2" /> Vendor Information
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span>{proposal.vendorName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Submission Date:</span>
                        <span>{format(new Date(proposal.submittedAt), "MMM d, yyyy")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" /> Financial Details
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Proposed Amount:</span>
                        <span>{proposal.price.toLocaleString()} {proposal.currency}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span>{tender.budget.toLocaleString()} {tender.currency}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Difference:</span>
                        <span className={proposal.price > tender.budget ? "text-red-500" : "text-green-500"}>
                          {(proposal.price - tender.budget).toLocaleString()} {proposal.currency}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {(proposal.notes || isEditing) && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    {isEditing ? (
                      <textarea
                        name="notes"
                        value={editedProposal?.notes || ''}
                        onChange={handleInputChange}
                        className="w-full min-h-[100px] border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <p>{proposal.notes}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-2">Tender Details</h3>
                <Card>
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link to={`/tenders/${tender.id}`}>
                            {tender.title}
                          </Link>
                        </Button>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span>{tender.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={
                          tender.status === "published" ? "secondary" :
                          tender.status === "evaluating" ? "default" :
                          tender.status === "awarded" ? "default" : "outline"
                        }>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </Badge>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Deadline:</span>
                        <span>{format(new Date(tender.deadline), "MMM d, yyyy")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Proposal Documents</h3>
              {proposal.documents.length > 0 ? (
                <div className="bg-gray-50 rounded-md border">
                  <ul className="divide-y">
                    {proposal.documents.map((doc) => (
                      <li key={doc.id} className="p-4 flex items-start justify-between">
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
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-md border text-center">
                  <p className="text-gray-500">No documents attached to this proposal.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {isAdminOrEvaluator && (
            <TabsContent value="evaluation" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Evaluation Scores</h3>
                  
                  {proposal.status === "underEvaluation" && (
                    <Button asChild>
                      <Link to={`/proposals/${proposal.id}/evaluate`}>
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        {proposal.evaluationScores && proposal.evaluationScores.length > 0 
                          ? "Continue Evaluation" 
                          : "Start Evaluation"}
                      </Link>
                    </Button>
                  )}
                </div>
                
                {proposal.evaluationScores && proposal.evaluationScores.length > 0 ? (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="p-3 border-b bg-gray-50">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-4 font-medium">Criteria</div>
                            <div className="col-span-3 font-medium">Evaluator</div>
                            <div className="col-span-2 font-medium text-center">Score</div>
                            <div className="col-span-3 font-medium">Comment</div>
                          </div>
                        </div>
                        
                        <ul className="divide-y">
                          {proposal.evaluationScores.map((score: EvaluationScore, index: number) => {
                            const criterion = tender.criteria.find(c => c.id === score.criteriaId);
                            return (
                              <li key={index} className="p-3">
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="col-span-4">{criterion?.name || "Unknown"}</div>
                                  <div className="col-span-3 text-sm">Evaluator {score.evaluatorId}</div>
                                  <div className="col-span-2 text-center font-medium">
                                    {score.score}/{criterion?.maxScore || 10}
                                  </div>
                                  <div className="col-span-3 text-sm text-gray-600">
                                    {score.comment || "No comment"}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Average Score:</span>
                            <span className="font-bold">
                              {(proposal.evaluationScores.reduce((sum, score) => sum + score.score, 0) / 
                                proposal.evaluationScores.length).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-md border text-center">
                    <p className="text-gray-500">
                      {proposal.status === "underEvaluation" 
                        ? "Evaluation has not started yet." 
                        : "No evaluation data available."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
          
          {isAdmin && (
            <TabsContent value="decision" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Decision</h3>
                
                <Card>
                  <CardContent className="p-6">
                    {proposal.status === "awarded" ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="bg-green-100 p-4 rounded-full mb-4">
                          <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h4 className="text-lg font-medium text-green-700 mb-2">
                          This proposal has been awarded
                        </h4>
                        <p className="text-gray-600 mb-4 text-center max-w-md">
                          The contract has been awarded to {proposal.vendorName} for 
                          {' '}{proposal.price.toLocaleString()} {proposal.currency}.
                        </p>
                        
                        <Button>Generate Award Certificate</Button>
                      </div>
                    ) : proposal.status === "rejected" ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="bg-red-100 p-4 rounded-full mb-4">
                          <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h4 className="text-lg font-medium text-red-700 mb-2">
                          This proposal has been rejected
                        </h4>
                        <p className="text-gray-600 mb-4 text-center max-w-md">
                          The proposal from {proposal.vendorName} was rejected.
                        </p>
                        
                        {proposal.notes && (
                          <div className="w-full bg-red-50 p-4 rounded-md border border-red-200 mb-4">
                            <h5 className="font-medium mb-1">Rejection Notes:</h5>
                            <p className="text-sm">{proposal.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-gray-600">
                          Make a decision about this proposal based on the evaluation results and other factors.
                        </p>
                        
                        <div className="border-t border-b py-4">
                          <h4 className="font-medium mb-3">Decision Options</h4>
                          
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Button variant="outline" className="flex-1 bg-green-50 hover:bg-green-100 border-green-200">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Accept Proposal
                              </Button>
                              
                              <Button variant="outline" className="flex-1 bg-red-50 hover:bg-red-100 border-red-200">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Proposal
                              </Button>
                            </div>
                            
                            <Button variant="outline" className="w-full">
                              Request Additional Information
                            </Button>
                          </div>
                        </div>
                        
                        <Button className="w-full">Create Award Decision</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProposalDetail;
