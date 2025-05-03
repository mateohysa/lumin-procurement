
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, HelpCircle, FileText, Users, Award, Book, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Help() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Resources</h1>
          <p className="text-muted-foreground mt-2">
            Find answers, documentation and support for using the Smart Procurement platform.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            className="pl-12 py-6 text-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Quick Start Guide</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn the basics of the platform in just a few minutes with our step-by-step guide.
              </p>
              <div className="flex items-center text-primary text-sm mt-4">
                Read guide
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Vendor Management</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn how to register vendors, manage submissions, and handle vendor communications.
              </p>
              <div className="flex items-center text-primary text-sm mt-4">
                View tutorials
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Evaluation Process</CardTitle>
              <Award className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed instructions on conducting fair and transparent proposal evaluations.
              </p>
              <div className="flex items-center text-primary text-sm mt-4">
                Read documentation
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="tenders">Tenders</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    How do I reset my password?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    Can I create multiple user accounts for my organization?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Yes, admins can create additional user accounts with different permission levels from the Settings page.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    Is my data secure on the platform?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Yes, we use industry-standard encryption and security practices to protect all data. Full details are in our Security Policy.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tenders" className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    Can I edit a tender after publishing?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    You can make minor edits to a published tender, but major changes may require cancelling and reissuing the tender.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    How do I extend a tender deadline?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Open the tender details, click "Edit Tender," and modify the deadline. All registered vendors will be notified automatically.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    What file formats are supported for tender documents?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    The platform supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx), and image files (.jpg, .png) for tender documents.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    Can I customize the report template?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Yes, admins can customize report templates from the Settings page, including adding your organization's logo and custom sections.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    How are final scores calculated in reports?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Final scores are calculated as weighted averages of all evaluator scores based on the criteria weights defined in the tender.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    Can I generate reports before all evaluations are complete?
                  </h4>
                  <p className="text-muted-foreground mt-2">
                    Yes, you can generate draft reports at any time, but they will be marked as preliminary until all evaluations are submitted.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2" />
              User Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Download the comprehensive user manual for detailed instructions on all platform features:
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-primary flex items-center hover:underline">
                <FileText className="h-5 w-5 mr-2" />
                User Manual (PDF)
              </a>
              <a href="#" className="text-primary flex items-center hover:underline">
                <FileText className="h-5 w-5 mr-2" />
                Quick Reference Guide
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
