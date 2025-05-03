
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import CreateTender from "./pages/CreateTender";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import AvailableTenders from "./pages/AvailableTenders";
import MySubmissions from "./pages/MySubmissions";
import MyEvaluations from "./pages/MyEvaluations";
import CompletedEvaluations from "./pages/CompletedEvaluations";
import Tenders from "./pages/Tenders";
import TenderDetail from "./pages/TenderDetail";
import TenderSubmissions from "./pages/TenderSubmissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import ApplyTender from "./pages/ApplyTender";
import EvaluateTender from "./pages/EvaluateTender";
import EvaluationForm from "./pages/EvaluationForm";
import EvaluationDetail from "./pages/EvaluationDetail";
import UpdateSubmission from "./pages/UpdateSubmission";
import Evaluators from "./pages/Evaluators";
import EditTender from "./pages/EditTender";
import Disputes from "./pages/Disputes";
import TenderDisputes from "./pages/TenderDisputes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forbidden" element={<Forbidden />} />
            
            {/* Protected routes for all authenticated users */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Admin only routes */}
            <Route path="/tenders" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Tenders />
              </ProtectedRoute>
            } />
            <Route path="/tenders/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'vendor', 'evaluator']}>
                <TenderDetail />
              </ProtectedRoute>
            } />
            <Route path="/tenders/:id/submissions" element={
              <ProtectedRoute allowedRoles={['admin', 'evaluator']}>
                <TenderSubmissions />
              </ProtectedRoute>
            } />
            <Route path="/tenders/:id/disputes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TenderDisputes />
              </ProtectedRoute>
            } />
            <Route path="/submissions/:id" element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            } />
            <Route path="/tenders/:id/edit" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditTender />
              </ProtectedRoute>
            } />
            <Route path="/create-tender" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateTender />
              </ProtectedRoute>
            } />
            <Route path="/vendors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Vendors />
              </ProtectedRoute>
            } />
            <Route path="/evaluators" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Evaluators />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/disputes" element={
              <ProtectedRoute allowedRoles={['admin', 'vendor']}>
                <Disputes />
              </ProtectedRoute>
            } />
            
            {/* Vendor only routes */}
            <Route path="/available-tenders" element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <AvailableTenders />
              </ProtectedRoute>
            } />
            <Route path="/apply-tender/:id" element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <ApplyTender />
              </ProtectedRoute>
            } />
            <Route path="/my-submissions" element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <MySubmissions />
              </ProtectedRoute>
            } />
            <Route path="/update-submission/:id" element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <UpdateSubmission />
              </ProtectedRoute>
            } />
            
            {/* Evaluator only routes */}
            <Route path="/evaluate-tender/:id" element={
              <ProtectedRoute allowedRoles={['evaluator']}>
                <EvaluateTender />
              </ProtectedRoute>
            } />
            <Route path="/evaluation-form/:id" element={
              <ProtectedRoute allowedRoles={['evaluator']}>
                <EvaluationForm />
              </ProtectedRoute>
            } />
            <Route path="/evaluation-detail/:id" element={
              <ProtectedRoute allowedRoles={['evaluator']}>
                <EvaluationDetail />
              </ProtectedRoute>
            } />
            <Route path="/my-evaluations" element={
              <ProtectedRoute allowedRoles={['evaluator']}>
                <MyEvaluations />
              </ProtectedRoute>
            } />
            <Route path="/completed-evaluations" element={
              <ProtectedRoute allowedRoles={['evaluator']}>
                <CompletedEvaluations />
              </ProtectedRoute>
            } />
            
            {/* Redirects for removed pages */}
            <Route path="/settings" element={<Navigate to="/" replace />} />
            <Route path="/help" element={<Navigate to="/" replace />} />
            <Route path="/submissions" element={<Navigate to="/" replace />} />
            <Route path="/evaluations" element={<Navigate to="/" replace />} />
            <Route path="/results" element={<Navigate to="/tenders" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
