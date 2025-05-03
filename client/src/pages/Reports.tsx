
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  Search, 
  FileText, 
  Download, 
  FileDown, 
  Calendar, 
  CircleCheck,
  Printer,
  CheckCircle,
  FileJson,
  Filter,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Expanded mock data for tender reports
const reports = [
  {
    id: 'R-2023-42',
    tenderId: 'T-2023-42',
    title: 'IT Infrastructure Upgrade',
    generatedDate: '2025-04-25',
    status: 'Draft',
    winningVendor: 'TechSolutions Inc.',
    author: 'Jane Smith',
    submissions: 5,
    averageScore: 4.2,
    version: '1.0',
    lastModified: '2025-04-26',
    lastModifiedBy: 'Jane Smith',
    accessHistory: [
      { user: 'Jane Smith', action: 'Created', date: '2025-04-25 14:30' },
      { user: 'John Doe', action: 'Viewed', date: '2025-04-25 15:45' }
    ]
  },
  {
    id: 'R-2023-41',
    tenderId: 'T-2023-41',
    title: 'Office Furniture Procurement',
    generatedDate: '2025-04-22',
    status: 'Final',
    winningVendor: 'SmartBuild Construction',
    author: 'John Doe',
    submissions: 4,
    averageScore: 3.8,
    version: '2.1',
    lastModified: '2025-04-24',
    lastModifiedBy: 'Sarah Williams',
    accessHistory: [
      { user: 'John Doe', action: 'Created', date: '2025-04-22 10:15' },
      { user: 'Sarah Williams', action: 'Modified', date: '2025-04-23 11:30' },
      { user: 'Michael Johnson', action: 'Viewed', date: '2025-04-24 09:20' },
      { user: 'Sarah Williams', action: 'Finalized', date: '2025-04-24 14:00' }
    ]
  },
  {
    id: 'R-2023-40',
    tenderId: 'T-2023-40',
    title: 'Consulting Services',
    generatedDate: '2025-04-18',
    status: 'Final',
    winningVendor: 'Global Consulting Group',
    author: 'Michael Johnson',
    submissions: 3,
    averageScore: 4.5,
    version: '1.3',
    lastModified: '2025-04-20',
    lastModifiedBy: 'Michael Johnson',
    accessHistory: [
      { user: 'Michael Johnson', action: 'Created', date: '2025-04-18 09:45' },
      { user: 'Jane Smith', action: 'Modified', date: '2025-04-19 13:20' },
      { user: 'Michael Johnson', action: 'Finalized', date: '2025-04-20 11:00' }
    ]
  },
  {
    id: 'R-2023-39',
    tenderId: 'T-2023-39',
    title: 'Marketing Campaign',
    generatedDate: '2025-04-15',
    status: 'Draft',
    winningVendor: 'Creative Design Studio',
    author: 'Sarah Williams',
    submissions: 6,
    averageScore: 3.9,
    version: '0.9',
    lastModified: '2025-04-17',
    lastModifiedBy: 'Sarah Williams',
    accessHistory: [
      { user: 'Sarah Williams', action: 'Created', date: '2025-04-15 16:00' },
      { user: 'Sarah Williams', action: 'Modified', date: '2025-04-17 10:30' }
    ]
  },
  {
    id: 'R-2023-38',
    tenderId: 'T-2023-38',
    title: 'Security System Installation',
    generatedDate: '2025-04-10',
    status: 'Signed',
    winningVendor: 'SecureTech Solutions',
    author: 'John Doe',
    submissions: 4,
    averageScore: 4.7,
    version: '2.0',
    lastModified: '2025-04-13',
    lastModifiedBy: 'Michael Johnson',
    accessHistory: [
      { user: 'John Doe', action: 'Created', date: '2025-04-10 11:15' },
      { user: 'Jane Smith', action: 'Modified', date: '2025-04-11 14:30' },
      { user: 'Michael Johnson', action: 'Finalized', date: '2025-04-12 09:45' },
      { user: 'Michael Johnson', action: 'Signed', date: '2025-04-13 14:15' }
    ]
  }
];

// Mock data for report scoring details
const scoringDetails = [
  { vendorName: 'TechSolutions Inc.', totalScore: 86, technicalScore: 28, experienceScore: 22, timelineScore: 13, budgetScore: 23 },
  { vendorName: 'Creative Design Studio', totalScore: 79, technicalScore: 24, experienceScore: 20, timelineScore: 15, budgetScore: 20 },
  { vendorName: 'Global Consulting Group', totalScore: 81, technicalScore: 25, experienceScore: 23, timelineScore: 12, budgetScore: 21 },
  { vendorName: 'Future Innovations Ltd', totalScore: 72, technicalScore: 22, experienceScore: 18, timelineScore: 12, budgetScore: 20 },
  { vendorName: 'SmartBuild Construction', totalScore: 68, technicalScore: 20, experienceScore: 15, timelineScore: 13, budgetScore: 20 }
];

// Mock data for evaluator comments
const evaluatorComments = [
  { 
    evaluator: 'Jane Smith',
    comments: {
      technical: 'The technical solution proposed is comprehensive and addresses all requirements. The architecture is well thought out.',
      experience: 'Strong track record with similar projects, documented case studies provided.',
      timeline: 'Timeline seems realistic and includes contingency planning.',
      budget: 'The proposed budget is within range but slightly higher than competitors.'
    }
  },
  { 
    evaluator: 'John Doe',
    comments: {
      technical: 'Good technical approach but missing some details on integration points.',
      experience: 'Team has relevant experience, but company is relatively new in this field.',
      timeline: 'Timeline looks optimistic, might need to extend certain phases.',
      budget: 'Budget breakdown is detailed and reasonable.'
    }
  },
  { 
    evaluator: 'Michael Johnson',
    comments: {
      technical: 'Innovative technical approach with clear methodology.',
      experience: 'Strong team with proven expertise in similar projects.',
      timeline: 'Implementation timeline is well-structured but could be more detailed.',
      budget: 'Good value for money, competitive pricing with comprehensive breakdown.'
    }
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Final' | 'Signed'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'ThisWeek' | 'ThisMonth'>('All');
  const [reportList, setReportList] = useState(reports);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    includeEvaluatorNames: true,
    includeInternalNotes: false,
    includeDocumentList: true,
    addWatermark: false,
    sendEmail: false
  });
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Filter reports based on search term, status filter, and date filter
  useEffect(() => {
    const filtered = reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        report.tenderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.winningVendor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'All') {
        const reportDate = new Date(report.generatedDate);
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (dateFilter === 'ThisWeek') {
          matchesDate = reportDate >= firstDayOfWeek;
        } else if (dateFilter === 'ThisMonth') {
          matchesDate = reportDate >= firstDayOfMonth;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    setReportList(filtered);
  }, [searchTerm, statusFilter, dateFilter]);
  
  // View report details
  const viewReport = (report: typeof reports[0]) => {
    setSelectedReport(report);
    
    // Add a view entry to access history (would actually be done server-side)
    const currentUser = 'Current User'; // This would come from auth context
    const viewEntry = {
      user: currentUser,
      action: 'Viewed',
      date: new Date().toLocaleString()
    };
    
    // In a real app, this would be an API call to update the report's access history
    console.log(`User ${currentUser} viewed report ${report.id} at ${viewEntry.date}`);
    
    setShowReportDialog(true);
  };
  
  // Generate file export (mock functionality)
  const generateExport = (format: string) => {
    if (!selectedReport) return;
    
    // Hide export options dialog
    setShowExportOptions(false);
    
    toast({
      title: `Generating ${format.toUpperCase()} Report`,
      description: "Your report is being prepared for download.",
    });
    
    // Simulate file generation delay
    setTimeout(() => {
      toast({
        title: `${format.toUpperCase()} Report Ready`,
        description: `${selectedReport.title} has been exported successfully.`,
      });
      
      // In a real app, this would trigger a download or open a new tab with the generated file
      console.log(`Exported report ${selectedReport.id} in ${format} format with settings:`, exportSettings);
      
      // Record the export action in access history (would be done server-side)
      const currentUser = 'Current User'; // This would come from auth context
      const exportEntry = {
        user: currentUser,
        action: `Exported as ${format.toUpperCase()}`,
        date: new Date().toLocaleString()
      };
      
      console.log(`User ${currentUser} exported report ${selectedReport.id} as ${format} at ${exportEntry.date}`);
    }, 1500);
  };
  
  // Finalize report (mock functionality)
  const finalizeReport = () => {
    if (!selectedReport) return;
    
    // Ask for confirmation
    if (window.confirm("Are you sure you want to finalize this report? You will not be able to edit it after this step.")) {
      toast({
        title: "Report Finalized",
        description: "The report has been marked as final and can no longer be edited.",
      });
      
      setShowReportDialog(false);
      
      // Update report status in the list
      setReportList(currentList => 
        currentList.map(report => 
          report.id === selectedReport.id 
            ? { ...report, status: 'Final' } 
            : report
        )
      );
      
      // Record the finalize action in access history (would be done server-side)
      const currentUser = 'Current User'; // This would come from auth context
      const finalizeEntry = {
        user: currentUser,
        action: 'Finalized',
        date: new Date().toLocaleString()
      };
      
      console.log(`User ${currentUser} finalized report ${selectedReport.id} at ${finalizeEntry.date}`);
    }
  };
  
  // Sign report (mock functionality)
  const signReport = () => {
    if (!selectedReport) return;
    
    toast({
      title: "Report Signed",
      description: "The report has been digitally signed and is now official.",
    });
    
    setShowReportDialog(false);
    
    // Update report status in the list
    setReportList(currentList => 
      currentList.map(report => 
        report.id === selectedReport.id 
          ? { ...report, status: 'Signed' } 
          : report
      )
    );
    
    // Record the sign action in access history (would be done server-side)
    const currentUser = 'Current User'; // This would come from auth context
    const signEntry = {
      user: currentUser,
      action: 'Signed',
      date: new Date().toLocaleString()
    };
    
    console.log(`User ${currentUser} signed report ${selectedReport.id} at ${signEntry.date}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'Final':
        return <Badge className="bg-green-100 text-green-800">Final</Badge>;
      case 'Signed':
        return <Badge className="bg-blue-100 text-blue-800">Signed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate, view, and download evaluation reports for tenders.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tender Evaluation Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by title, ID, or vendor..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant={statusFilter === 'All' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setStatusFilter('All')}
                          >
                            All
                          </Button>
                          <Button 
                            variant={statusFilter === 'Draft' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setStatusFilter('Draft')}
                          >
                            Draft
                          </Button>
                          <Button 
                            variant={statusFilter === 'Final' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setStatusFilter('Final')}
                          >
                            Final
                          </Button>
                          <Button 
                            variant={statusFilter === 'Signed' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setStatusFilter('Signed')}
                          >
                            Signed
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant={dateFilter === 'All' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDateFilter('All')}
                          >
                            All Time
                          </Button>
                          <Button 
                            variant={dateFilter === 'ThisWeek' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDateFilter('ThisWeek')}
                          >
                            This Week
                          </Button>
                          <Button 
                            variant={dateFilter === 'ThisMonth' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setDateFilter('ThisMonth')}
                          >
                            This Month
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Select
                  defaultValue={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as 'All' | 'Draft' | 'Final' | 'Signed')}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Signed">Signed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Tender Title</TableHead>
                    <TableHead>Generated Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Winning Vendor</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No reports found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportList.map((report) => (
                      <TableRow key={report.id} className="group">
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(report.generatedDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.winningVendor}</TableCell>
                        <TableCell>v{report.version}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewReport(report)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setShowExportOptions(true);
                              }}
                            >
                              <FileDown className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <div>
                {selectedReport?.title} - Evaluation Report
                {selectedReport?.status === 'Final' && (
                  <Badge className="ml-2 bg-green-100 text-green-800">Final</Badge>
                )}
                {selectedReport?.status === 'Signed' && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Signed</Badge>
                )}
              </div>
              <div className="text-sm font-normal flex items-center">
                <span className="mr-2 text-muted-foreground">v{selectedReport?.version}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setShowVersionHistory(true)}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  History
                </Button>
              </div>
            </DialogTitle>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <span>Last modified {selectedReport?.lastModified} by {selectedReport?.lastModifiedBy}</span>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            {selectedReport && (
              <div className="space-y-8">
                {/* Report Header */}
                <div className="pb-4 border-b">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Report ID</p>
                      <p className="font-medium">{selectedReport.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tender ID</p>
                      <p className="font-medium">{selectedReport.tenderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Generated Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <p>{new Date(selectedReport.generatedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(selectedReport.status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prepared By</p>
                      <p>{selectedReport.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submissions</p>
                      <p>{selectedReport.submissions} vendors</p>
                    </div>
                  </div>
                </div>

                {/* Report Tabs */}
                <Tabs defaultValue="summary">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="scores">Scoring Details</TabsTrigger>
                    <TabsTrigger value="comments">Evaluator Comments</TabsTrigger>
                    <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                  </TabsList>
                  
                  {/* Summary Tab */}
                  <TabsContent value="summary" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Tender Summary</h3>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <p>
                            This report summarizes the evaluation process for <strong>{selectedReport.title}</strong>. 
                            A total of {selectedReport.submissions} vendors submitted proposals which were evaluated 
                            against the pre-defined criteria. Based on the cumulative scoring, <strong>{selectedReport.winningVendor}</strong> 
                            was selected as the winning vendor with an average score of {selectedReport.averageScore}/5.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Decision Summary</h3>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-base">{selectedReport.winningVendor} Selected</h4>
                              <p className="text-sm mt-2">
                                After careful evaluation of all submissions, {selectedReport.winningVendor} has been 
                                selected for this tender based on their superior technical proposal, proven experience, 
                                realistic timeline, and competitive pricing. The vendor demonstrated exceptional understanding 
                                of the requirements and provided a comprehensive solution.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">AI-Generated Report Summary</h3>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                          <p className="text-sm italic">
                            Based on the evaluation scores and comments, {selectedReport.winningVendor} demonstrated 
                            superior compliance with the tender requirements, receiving the highest scores in technical 
                            solution ({scoringDetails[0].technicalScore}/30) and experience ({scoringDetails[0].experienceScore}/25). 
                            The evaluation panel unanimously recommends awarding the contract to {selectedReport.winningVendor}, 
                            subject to final review by the procurement committee. This recommendation is supported by consistent 
                            scoring across all evaluators and the vendor's comprehensive documentation.
                          </p>
                          <div className="text-xs text-blue-600 mt-3 flex items-center">
                            <span>AI-generated summary based on evaluation data</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        <p>Report generated on {new Date(selectedReport.generatedDate).toLocaleDateString()}</p>
                        <p>Reference: {selectedReport.id}</p>
                      </div>
                      <div>
                        {selectedReport.status === 'Final' && (
                          <div className="flex items-center gap-1 text-green-700">
                            <CircleCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">Finalized</span>
                          </div>
                        )}
                        {selectedReport.status === 'Signed' && (
                          <div className="flex items-center gap-1 text-blue-700">
                            <CircleCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">Signed & Official</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Scores Tab */}
                  <TabsContent value="scores" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Vendor Scoring Overview</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vendor</TableHead>
                              <TableHead className="text-center">Technical (30%)</TableHead>
                              <TableHead className="text-center">Experience (25%)</TableHead>
                              <TableHead className="text-center">Timeline (15%)</TableHead>
                              <TableHead className="text-center">Budget (30%)</TableHead>
                              <TableHead className="text-center">Total Score</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scoringDetails.map((vendor, index) => (
                              <TableRow key={index} className={vendor.vendorName === selectedReport.winningVendor ? "bg-green-50" : ""}>
                                <TableCell className="font-medium">
                                  {vendor.vendorName}
                                  {vendor.vendorName === selectedReport.winningVendor && (
                                    <Badge className="ml-2 bg-green-100 text-green-800">Winner</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">{vendor.technicalScore}/30</TableCell>
                                <TableCell className="text-center">{vendor.experienceScore}/25</TableCell>
                                <TableCell className="text-center">{vendor.timelineScore}/15</TableCell>
                                <TableCell className="text-center">{vendor.budgetScore}/30</TableCell>
                                <TableCell className="text-center font-bold">{vendor.totalScore}/100</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Comments Tab */}
                  <TabsContent value="comments" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Evaluator Feedback for {selectedReport.winningVendor}</h3>
                      
                      {evaluatorComments.map((evaluator, index) => (
                        <Card key={index} className="mb-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{evaluator.evaluator}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium">Technical Solution</h4>
                                <p className="text-sm text-muted-foreground">{evaluator.comments.technical}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Experience & Expertise</h4>
                                <p className="text-sm text-muted-foreground">{evaluator.comments.experience}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Implementation Timeline</h4>
                                <p className="text-sm text-muted-foreground">{evaluator.comments.timeline}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Budget & Cost Efficiency</h4>
                                <p className="text-sm text-muted-foreground">{evaluator.comments.budget}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {/* Audit Trail Tab */}
                  <TabsContent value="audit" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Report Access & Modification Log</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Date & Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedReport.accessHistory.map((entry, index) => (
                              <TableRow key={index}>
                                <TableCell>{entry.user}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={cn({
                                    "bg-green-50 text-green-800": entry.action === "Created" || entry.action === "Finalized" || entry.action === "Signed",
                                    "bg-blue-50 text-blue-800": entry.action === "Modified",
                                    "bg-gray-50 text-gray-800": entry.action === "Viewed",
                                  })}>
                                    {entry.action}
                                  </Badge>
                                </TableCell>
                                <TableCell>{entry.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowExportOptions(true)}>
                  <FileDown className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
              
              <div>
                {selectedReport?.status === 'Draft' && (
                  <Button onClick={finalizeReport} className="bg-green-600 hover:bg-green-700">
                    <CircleCheck className="h-4 w-4 mr-1" />
                    Finalize Report
                  </Button>
                )}
                {selectedReport?.status === 'Final' && (
                  <Button onClick={signReport} className="bg-blue-600 hover:bg-blue-700">
                    <CircleCheck className="h-4 w-4 mr-1" />
                    Sign Report
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Report Options</DialogTitle>
            <DialogDescription>
              Customize what will be included in your exported report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 justify-start"
                  onClick={() => generateExport('pdf')}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 justify-start"
                  onClick={() => generateExport('docx')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  DOCX
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 justify-start"
                  onClick={() => generateExport('json')}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Include in Export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="evaluator-names" 
                    checked={exportSettings.includeEvaluatorNames}
                    onCheckedChange={(checked) => 
                      setExportSettings({...exportSettings, includeEvaluatorNames: !!checked})
                    }
                  />
                  <Label htmlFor="evaluator-names">Evaluator Names</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="internal-notes" 
                    checked={exportSettings.includeInternalNotes}
                    onCheckedChange={(checked) => 
                      setExportSettings({...exportSettings, includeInternalNotes: !!checked})
                    }
                  />
                  <Label htmlFor="internal-notes">Internal Notes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="document-list" 
                    checked={exportSettings.includeDocumentList}
                    onCheckedChange={(checked) => 
                      setExportSettings({...exportSettings, includeDocumentList: !!checked})
                    }
                  />
                  <Label htmlFor="document-list">Document List</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="add-watermark" 
                    checked={exportSettings.addWatermark}
                    onCheckedChange={(checked) => 
                      setExportSettings({...exportSettings, addWatermark: !!checked})
                    }
                  />
                  <Label htmlFor="add-watermark">Add "Confidential" Watermark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="send-email" 
                    checked={exportSettings.sendEmail}
                    onCheckedChange={(checked) => 
                      setExportSettings({...exportSettings, sendEmail: !!checked})
                    }
                  />
                  <Label htmlFor="send-email">Send Copy to Email</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportOptions(false)}>
              Cancel
            </Button>
            <Button onClick={() => generateExport('pdf')}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              Track changes made to this report over time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Modified By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock version history */}
                  <TableRow>
                    <TableCell>v2.1</TableCell>
                    <TableCell>{selectedReport?.lastModifiedBy}</TableCell>
                    <TableCell>
                      {new Date(selectedReport?.lastModified || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Current</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="text-muted-foreground">
                    <TableCell>v2.0</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      {new Date("2025-04-23").toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="text-muted-foreground">
                    <TableCell>v1.0</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      {new Date("2025-04-22").toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
