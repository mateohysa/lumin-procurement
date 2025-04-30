
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Tender, Document } from "../types";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Upload,
  FileText,
  DollarSign,
  Clock,
  Tag
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../hooks/use-toast";

const formSchema = z.object({
  price: z.string().min(1, "Price is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: "Price must be a positive number" }
  ),
  notes: z.string().optional(),
  documents: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateProposal = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "",
      notes: "",
      documents: null,
    },
  });

  useEffect(() => {
    const fetchTender = async () => {
      try {
        if (id) {
          setLoading(true);
          const tenderData = await api.tenders.getById(id);
          setTender(tenderData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching tender:", error);
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const isDeadlinePassed = tender ? isAfter(new Date(), new Date(tender.deadline)) : false;
  const canSubmitProposal = tender?.status === "published" && !isDeadlinePassed;

  const onSubmit = async (values: FormValues) => {
    if (!tender || !user) return;

    try {
      setSubmitting(true);

      // Mock file upload
      const uploadedDocuments: Document[] = uploadedFiles.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        description: `Uploaded for proposal to ${tender.title}`,
        fileUrl: URL.createObjectURL(file), // This would be a server URL in real app
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        version: 1,
      }));

      const proposal = {
        tenderId: tender.id,
        vendorId: user.id,
        vendorName: user.name || "Vendor",
        price: parseFloat(values.price),
        currency: tender.currency,
        documents: uploadedDocuments,
        notes: values.notes,
        status: "submitted" as const,
      };

      await api.proposals.create(proposal);
      
      toast({
        title: "Proposal submitted successfully!",
        description: "Your proposal has been submitted.",
      });
      
      navigate("/my-proposals");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Error submitting proposal",
        description: "There was a problem submitting your proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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

  if (!canSubmitProposal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Cannot Submit Proposal</h2>
        <p className="text-gray-500 mb-4">
          {isDeadlinePassed
            ? "The deadline for this tender has passed."
            : "This tender is no longer accepting proposals."}
        </p>
        <Button asChild>
          <Link to={`/tenders/${tender.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Tender Details
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
            <Link to={`/tenders/${tender.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Tender
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Proposal</CardTitle>
              <CardDescription>
                Complete the form below to submit your proposal for {tender.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ({tender.currency})</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Enter your price" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter your proposed price for the tender in {tender.currency}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes or information about your proposal"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide any additional information that might help your proposal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documents"
                    render={() => (
                      <FormItem>
                        <FormLabel>Proposal Documents</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-md border-gray-300 p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Drag and drop your files here, or click to upload
                              </p>
                              <Input
                                type="file"
                                multiple
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileChange}
                              />
                              <label htmlFor="file-upload">
                                <Button type="button" variant="outline" size="sm">
                                  Select Files
                                </Button>
                              </label>
                            </div>
                            
                            {uploadedFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Uploaded Files:</p>
                                <ul className="space-y-2">
                                  {uploadedFiles.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{file.name}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => removeFile(index)}
                                      >
                                        &times;
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload any relevant documents for your proposal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                        Submitting...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tender Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-lg mb-2">{tender.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">{tender.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Category: {tender.category}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Budget: {tender.budget.toLocaleString()} {tender.currency}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Deadline: {format(new Date(tender.deadline), "MMM d, yyyy")}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Required Documents</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Technical proposal</li>
                  <li>Financial proposal</li>
                  <li>Company profile</li>
                  <li>References from previous work</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/tenders/${tender.id}`}>
                  View Complete Tender Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;
