import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import TenderList from "./pages/TenderList";
import TenderDetail from "./pages/TenderDetail";
import ProposalList from "./pages/ProposalList";
import MyProposals from "./pages/MyProposals";
import ProposalDetail from "./pages/ProposalDetail";
import CreateProposal from "./pages/CreateProposal";
import ProposalEvaluation from "./pages/ProposalEvaluation";
import DecisionList from "./pages/DecisionList";
import DecisionDetail from "./pages/DecisionDetail";
import VendorList from "./pages/VendorList";
import VendorDetail from "./pages/VendorDetail";
import ReportList from "./pages/ReportList";
import ReportDetail from "./pages/ReportDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders"
                  element={
                    <ProtectedRoute>
                      <TenderList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders/:id"
                  element={
                    <ProtectedRoute>
                      <TenderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders/:id/apply"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <CreateProposal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proposals"
                  element={
                    <ProtectedRoute>
                      <ProposalList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-proposals"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <MyProposals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proposals/:id"
                  element={
                    <ProtectedRoute>
                      <ProposalDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proposals/:id/evaluate"
                  element={
                    <ProtectedRoute>
                      <ProposalEvaluation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decisions"
                  element={
                    <ProtectedRoute>
                      <DecisionList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decisions/:id"
                  element={
                    <ProtectedRoute>
                      <DecisionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendors"
                  element={
                    <ProtectedRoute>
                      <VendorList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendors/:id"
                  element={
                    <ProtectedRoute>
                      <VendorDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/:id"
                  element={
                    <ProtectedRoute>
                      <ReportDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
