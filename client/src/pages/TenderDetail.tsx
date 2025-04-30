import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Tender, Document, Question, TenderStatus } from "../types";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  Calendar,
  Bookmark,
  Tag,
  DollarSign,
  Clock,
  Users,
  MessageSquare,
  ClipboardCheck,
  FilePlus,
  ArrowLeft,
  Loader2,
  Award,
  Pencil
} from "lucide-react";
import { format, isAfter } from "date-fns";

const getStatusBadgeVariant = (status: TenderStatus) => {
  switch (status) {
    case "draft":
      return "outline";
    case "published":
      return "secondary";
    case "evaluating":
      return "default";
    case "awarded":
      return "default"; // Changed from "success" to "default"
    case "canceled":
      return "destructive";
    case "archived":
      return "outline";
    default:
      return "outline";
  }
};

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [tender, setTender] = useState<Tender | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTender, setEditedTender] = useState<Partial<Tender> | null>(null);

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        if (id) {
          setLoading(true);
          const tenderData = await api.tenders.getById(id);
          setTender(tenderData);
          setEditedTender(tenderData);
          
          // Fetch proposals if user is not a vendor
          if (user?.role !== "vendor") {
            const proposalData = await api.proposals.getAll(id);
            setProposals(proposalData);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching tender data:", error);
        setLoading(false);
      }
    };

    fetchTenderData();
  }, [id, user?.role]);

  const isDeadlinePassed = tender ? isAfter(new Date(), new Date(tender.deadline)) : false;
  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";
  const isPublished = tender?.status === "published";
  const canSubmitProposal = isVendor && isPublished && !isDeadlinePassed;
  const canEditTender = isAdmin && tender?.status !== "awarded" && tender?.status !== "archived";

  const handleEditToggle = () => {
    if (isEditing && editedTender) {
      // Save changes
      handleSaveTender();
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleSaveTender = async () => {
    if (!editedTender || !tender) return;
    
    try {
      // In a real app, this would be an API call to update the tender
      console.log("Saving tender changes:", editedTender);
      
      // Mock API call
      const updatedTender = await api.tenders.update(tender.id, editedTender);
      setTender(updatedTender);
      setIsEditing(false);
      
      // Show success toast
      // toast({
      //   title: "Tender updated",
      //   description: "The tender has been updated successfully.",
      // });
    } catch (error) {
      console.error("Error updating tender:", error);
      // Show error toast
      // toast({
      //   title: "Error",
      //   description: "Failed to update tender. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTender(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setEditedTender(prev => prev ? { ...prev, [name]: numValue } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading tender details...</span>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Tender not found</h2>
        <p className="text-gray-500 mb-4">The requested tender could not be found.</p>
        <Button asChild>
          <Link to="/tenders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenders
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
            <Link to="/tenders">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <Badge variant={getStatusBadgeVariant(tender.status) as any} className="ml-2">
            {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {canEditTender && (
            <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"}>
              <Pencil className="h-4 w-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Tender"}
            </Button>
          )}
          
          {canSubmitProposal && (
            <Button asChild>
              <Link to={`/tenders/${tender.id}/apply`}>
                <FilePlus className="h-4 w-4 mr-2" />
                Submit Proposal
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          {isEditing ? (
            <input 
              type="text" 
              name="title"
              value={editedTender?.title || ''} 
              onChange={handleInputChange}
              className="text-2xl font-bold mb-2 w-full border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{tender.title}</h1>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Published: {format(new Date(tender.publishDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {isEditing ? (
                <input 
                  type="date" 
                  name="deadline"
                  value={editedTender?.deadline ? new Date(editedTender.deadline).toISOString().split('T')[0] : ''} 
                  onChange={handleInputChange}
                  className="ml-1 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <span>Deadline: {format(new Date(tender.deadline), "MMM d, yyyy")}</span>
              )}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {isEditing ? (
                <input 
                  type="text" 
                  name="category"
                  value={editedTender?.category || ''} 
                  onChange={handleInputChange}
                  className="ml-1 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <span>{tender.category}</span>
              )}
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {isEditing ? (
                <div className="flex">
                  <input 
                    type="number" 
                    name="budget"
                    value={editedTender?.budget || 0} 
                    onChange={handleNumberChange}
                    className="ml-1 w-32 border border-gray-300 rounded px-2 py-1"
                  />
                  <input 
                    type="text" 
                    name="currency"
                    value={editedTender?.currency || ''} 
                    onChange={handleInputChange}
                    className="ml-1 w-16 border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ) : (
                <span>{tender.budget.toLocaleString()} {tender.currency}</span>
              )}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 pl-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="criteria">Evaluation Criteria</TabsTrigger>
              {!isVendor && (
                <TabsTrigger value="proposals">
                  Proposals ({proposals.length})
                </TabsTrigger>
              )}
              {!isVendor && tender.status === "evaluating" && (
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              )}
              {!isVendor && (
                <TabsTrigger value="reports">Reports</TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="bg-gray-50 p-4 rounded-md border">
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editedTender?.description || ''}
                      onChange={handleInputChange}
                      className="w-full min-h-[150px] border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <p>{tender.description}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Timeline
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Published:</span>
                        <span>{format(new Date(tender.publishDate), "MMM d, yyyy")}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Submission Deadline:</span>
                        <span>{format(new Date(tender.deadline), "MMM d, yyyy")}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Time Remaining:</span>
                        <span>
                          {isDeadlinePassed 
                            ? "Deadline passed" 
                            : "Open for submissions"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Bookmark className="h-4 w-4 mr-2" /> Overview
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span>{tender.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span>{tender.budget.toLocaleString()} {tender.currency}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={getStatusBadgeVariant(tender.status) as any}>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </Badge>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tender Documents</h3>
              {tender.documents.length > 0 ? (
                <div className="bg-gray-50 rounded-md border">
                  <ul className="divide-y">
                    {tender.documents.map((doc) => (
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
                  <p className="text-gray-500">No documents available for this tender.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions & Answers</h3>
                {isVendor && isPublished && !isDeadlinePassed && (
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                )}
              </div>
              
              {tender.questions.length > 0 ? (
                <div className="space-y-4">
                  {tender.questions.map((question) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium">{question.question}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Asked on {format(new Date(question.askedAt), "MMM d, yyyy")}
                            </div>
                          </div>
                          
                          {question.answer ? (
                            <div className="bg-gray-50 p-3 rounded-md mt-2 border-l-4 border-blue-400">
                              <div className="text-sm">{question.answer}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Answered on {question.answeredAt ? format(new Date(question.answeredAt), "MMM d, yyyy") : "N/A"}
                              </div>
                            </div>
                          ) : (
                            <div className="italic text-gray-500 text-sm">
                              This question has not been answered yet.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-md border text-center">
                  <p className="text-gray-500">No questions have been asked yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="criteria" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Evaluation Criteria</h3>
              
              <div className="bg-gray-50 rounded-md border">
                <div className="p-4 border-b bg-gray-100">
                  <div className="grid grid-cols-12 gap-4 font-medium">
                    <div className="col-span-5">Criteria</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Weight</div>
                  </div>
                </div>
                
                <ul className="divide-y">
                  {tender.criteria.map((criterion) => (
                    <li key={criterion.id} className="p-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5 font-medium">{criterion.name}</div>
                        <div className="col-span-5 text-sm">{criterion.description}</div>
                        <div className="col-span-2 text-center">{criterion.weight}%</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {!isVendor && (
            <TabsContent value="proposals" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Submitted Proposals</h3>
                
                {proposals.length > 0 ? (
                  <div className="bg-gray-50 rounded-md border">
                    <div className="p-4 border-b bg-gray-100">
                      <div className="grid grid-cols-12 gap-4 font-medium">
                        <div className="col-span-4">Vendor</div>
                        <div className="col-span-3">Submitted</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>
                    </div>
                    
                    <ul className="divide-y">
                      {proposals.map((proposal) => (
                        <li key={proposal.id} className="p-4">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4 font-medium">{proposal.vendorName}</div>
                            <div className="col-span-3 text-sm">
                              {format(new Date(proposal.submittedAt), "MMM d, yyyy")}
                            </div>
                            <div className="col-span-2">
                              {proposal.price.toLocaleString()} {proposal.currency}
                            </div>
                            <div className="col-span-2">
                              <Badge variant={
                                proposal.status === "awarded" ? "success" : 
                                proposal.status === "rejected" ? "destructive" : 
                                "secondary"
                              }>
                                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="col-span-1 text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/proposals/${proposal.id}`}>
                                  View
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-md border text-center">
                    <p className="text-gray-500">No proposals have been submitted yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
          
          {!isVendor && tender.status === "evaluating" && (
            <TabsContent value="evaluation" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Proposal Evaluation</h3>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          Evaluation Progress
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Track the evaluation progress for each proposal.
                        </p>
                      </div>
                      <Button>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Evaluators
                      </Button>
                    </div>
                    
                    {proposals.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {proposals.map((proposal) => (
                            <div key={proposal.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="font-medium">{proposal.vendorName}</h5>
                                  <p className="text-sm text-gray-500">
                                    Submitted: {format(new Date(proposal.submittedAt), "MMM d, yyyy")}
                                  </p>
                                </div>
                                <Badge variant={
                                  proposal.status === "awarded" ? "success" : 
                                  proposal.status === "rejected" ? "destructive" : 
                                  "secondary"
                                }>
                                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm">Evaluation Progress:</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${proposal.evaluationScores ? 75 : 0}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Not Started</span>
                                  <span>In Progress</span>
                                  <span>Complete</span>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <Button size="sm" variant="outline" className="w-full" asChild>
                                  <Link to={`/proposals/${proposal.id}/evaluate`}>
                                    {proposal.evaluationScores ? "Continue Evaluation" : "Start Evaluation"}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-md border text-center">
                        <p className="text-gray-500">No proposals available for evaluation.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
          
          {!isVendor && (
            <TabsContent value="reports" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Reports & Tracking</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">Tender Timeline</h4>
                      <div className="space-y-4">
                        <div className="relative flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full border-2 border-green-500">
                            <Calendar className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1 ml-4">
                            <h5 className="text-sm font-medium">Published</h5>
                            <p className="text-xs text-gray-500">
                              {format(new Date(tender.publishDate), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            isDeadlinePassed ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-300"
                          }`}>
                            <Clock className={`h-5 w-5 ${isDeadlinePassed ? "text-green-500" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1 ml-4">
                            <h5 className="text-sm font-medium">Submission Deadline</h5>
                            <p className="text-xs text-gray-500">
                              {format(new Date(tender.deadline), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            tender.status === "evaluating" || tender.status === "awarded" 
                              ? "bg-green-100 border-green-500" 
                              : "bg-gray-100 border-gray-300"
                          }`}>
                            <ClipboardCheck className={`h-5 w-5 ${
                              tender.status === "evaluating" || tender.status === "awarded" 
                                ? "text-green-500" 
                                : "text-gray-500"
                            }`} />
                          </div>
                          <div className="flex-1 ml-4">
                            <h5 className="text-sm font-medium">Evaluation</h5>
                            <p className="text-xs text-gray-500">
                              {tender.status === "evaluating" 
                                ? "In progress" 
                                : tender.status === "awarded" 
                                ? "Completed" 
                                : "Not started"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            tender.status === "awarded" 
                              ? "bg-green-100 border-green-500" 
                              : "bg-gray-100 border-gray-300"
                          }`}>
                            <Award className={`h-5 w-5 ${tender.status === "awarded" ? "text-green-500" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1 ml-4">
                            <h5 className="text-sm font-medium">Award Decision</h5>
                            <p className="text-xs text-gray-500">
                              {tender.status === "awarded" ? "Contract awarded" : "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">Reports</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" disabled={!isDeadlinePassed}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Proposals Summary Report
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start" disabled={tender.status !== "evaluating" && tender.status !== "awarded"}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Evaluation Report
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start" disabled={tender.status !== "awarded"}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Award Decision Report
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Export Tender Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default TenderDetail;
