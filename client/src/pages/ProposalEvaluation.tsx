import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Proposal, Tender, EvaluationCriteria } from "../types";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, 
} from "../components/ui/card";
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
  ArrowLeft,
  Loader2,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../hooks/use-toast";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

// Dynamic schema based on criteria
const createFormSchema = (criteria: EvaluationCriteria[]) => {
  const schemaObj: any = {};
  
  criteria.forEach(criterion => {
    schemaObj[`score_${criterion.id}`] = z.number()
      .min(criterion.minScore, `Minimum score is ${criterion.minScore}`)
      .max(criterion.maxScore, `Maximum score is ${criterion.maxScore}`);
    
    schemaObj[`comment_${criterion.id}`] = z.string().optional();
  });
  
  schemaObj.evaluationNotes = z.string().optional();
  
  return z.object(schemaObj);
};

const ProposalEvaluation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSchema, setFormSchema] = useState<z.ZodType<any>>(z.object({}));
  const [defaultValues, setDefaultValues] = useState<any>({});
  
  // New state for step-based evaluation
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          setLoading(true);
          const proposalData = await api.proposals.getById(id);
          setProposal(proposalData);

          if (proposalData) {
            const tenderData = await api.tenders.getById(proposalData.tenderId);
            setTender(tenderData);
            
            // Create schema based on tender criteria
            if (tenderData) {
              // Set total steps: criteria + final notes step
              setTotalSteps(tenderData.criteria.length + 1);
              
              const schema = createFormSchema(tenderData.criteria);
              setFormSchema(schema);
              
              // Set default values
              const values: any = {};
              tenderData.criteria.forEach(criterion => {
                // Check if this evaluator already scored this criterion
                const existingScore = proposalData.evaluationScores?.find(
                  score => score.criteriaId === criterion.id && score.evaluatorId === user?.id
                );
                
                values[`score_${criterion.id}`] = existingScore?.score || criterion.minScore;
                values[`comment_${criterion.id}`] = existingScore?.comment || "";
              });
              
              values.evaluationNotes = "";
              setDefaultValues(values);
              form.reset(values);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        toast({
          title: "Error loading data",
          description: "Failed to load proposal or tender data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [id, user?.id, form]);

  const isAdmin = user?.role === "admin";
  const isEvaluator = user?.role === "evaluator";
  const canEvaluate = isAdmin || isEvaluator;

  const goToNextStep = () => {
    // Validate current step before proceeding
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (values: any) => {
    if (!proposal || !tender || !user) return;

    try {
      setSubmitting(true);
      
      // Extract scores and comments from form values
      const evaluationScores = tender.criteria.map(criterion => ({
        criteriaId: criterion.id,
        evaluatorId: user.id,
        score: values[`score_${criterion.id}`],
        comment: values[`comment_${criterion.id}`] || undefined,
      }));
      
      // Merge with existing scores from other evaluators
      const existingScores = proposal.evaluationScores?.filter(
        score => score.evaluatorId !== user.id
      ) || [];
      
      const updatedProposal = {
        ...proposal,
        evaluationScores: [...existingScores, ...evaluationScores],
        notes: proposal.notes 
          ? `${proposal.notes}\n\nEvaluation Notes (${user.name}): ${values.evaluationNotes}`
          : `Evaluation Notes (${user.name}): ${values.evaluationNotes}`,
      };
      
      await api.proposals.update(proposal.id, updatedProposal);
      
      toast({
        title: "Evaluation submitted successfully!",
        description: "Your evaluation has been recorded.",
      });
      
      navigate(`/proposals/${proposal.id}`);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast({
        title: "Error submitting evaluation",
        description: "There was a problem saving your evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading evaluation data...</span>
      </div>
    );
  }

  // Render error state if proposal or tender not found
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

  // Render access denied if user doesn't have permission
  if (!canEvaluate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-4">You don't have permission to evaluate proposals.</p>
        <Button asChild>
          <Link to={`/proposals/${proposal.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Proposal Details
          </Link>
        </Button>
      </div>
    );
  }

  // Get current criterion based on step
  const getCurrentContent = () => {
    // If it's the last step, show the evaluation notes
    if (currentStep === totalSteps - 1) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-4">Final Evaluation Notes</h3>
            <p className="text-gray-500 mb-4">
              Provide your overall assessment of this proposal. Consider all criteria you've evaluated and
              give your final thoughts on the proposal's strengths and weaknesses.
            </p>
          </div>
          <FormField
            control={form.control}
            name="evaluationNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Evaluation Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add overall notes about your evaluation..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide any additional information about your overall evaluation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }
    
    // Otherwise show the criterion for the current step
    const criterion = tender.criteria[currentStep];
    return (
      <div key={criterion.id} className="space-y-6">
        <div>
          <h3 className="text-xl font-medium">{criterion.name}</h3>
          <p className="text-gray-500 mt-2">{criterion.description}</p>
          <Badge variant="outline" className="mt-2 bg-gray-100">
            Weight: {criterion.weight}%
          </Badge>
        </div>
        
        <FormField
          control={form.control}
          name={`score_${criterion.id}`}
          render={({ field }) => (
            <FormItem className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Score</FormLabel>
                  <span className="text-lg font-bold">{field.value}</span>
                </div>
                <FormControl>
                  <div className="pt-4">
                    <Slider
                      min={criterion.minScore}
                      max={criterion.maxScore}
                      step={1}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                    />
                  </div>
                </FormControl>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Min: {criterion.minScore}</span>
                  <span>Max: {criterion.maxScore}</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`comment_${criterion.id}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add comments to justify your score..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details on why you gave this score
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/proposals/${proposal.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Proposal
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evaluate Proposal</CardTitle>
              <CardDescription>
                Score each criterion to evaluate this proposal from {proposal.vendorName}
              </CardDescription>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                  <span>{Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete</span>
                </div>
                <Progress value={(currentStep / (totalSteps - 1)) * 100} />
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {getCurrentContent()}
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < totalSteps - 1 ? (
                      <Button 
                        type="button" 
                        onClick={goToNextStep}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Submit Evaluation
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Proposal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                  <p className="font-medium">{proposal.vendorName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="font-medium">
                    {proposal.price.toLocaleString()} {proposal.currency}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                  <p>{format(new Date(proposal.submittedAt), "MMM d, yyyy")}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Tender Information</h3>
                  <p className="text-sm mb-2">
                    <span className="font-medium">{tender.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Budget: {tender.budget.toLocaleString()} {tender.currency}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/proposals/${proposal.id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Proposal
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/tenders/${tender.id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Tender Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p>Score each criterion based on the provided scale</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p>Provide detailed comments to justify your scores</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p>Be objective and fair in your assessment</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p>Avoid conflicts of interest when evaluating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalEvaluation;
