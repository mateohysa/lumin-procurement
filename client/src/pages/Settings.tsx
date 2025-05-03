
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileDown, Search, Calendar, User, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for audit logs
const auditLogs = [
  { 
    id: 1, 
    user: 'John Doe', 
    action: 'Created new tender', 
    details: 'IT Infrastructure Upgrade (T-2023-42)', 
    timestamp: '2025-04-30T10:15:00Z', 
    ip: '192.168.1.105' 
  },
  { 
    id: 2, 
    user: 'Jane Smith', 
    action: 'Submitted evaluation', 
    details: 'Scored TechSolutions Inc. proposal for T-2023-42', 
    timestamp: '2025-04-30T11:23:00Z', 
    ip: '192.168.1.110' 
  },
  { 
    id: 3, 
    user: 'Michael Johnson', 
    action: 'Generated report', 
    details: 'Final report for Consulting Services (T-2023-40)', 
    timestamp: '2025-04-29T15:45:00Z', 
    ip: '192.168.1.115' 
  },
  { 
    id: 4, 
    user: 'Sarah Williams', 
    action: 'Approved tender', 
    details: 'Marketing Campaign (T-2023-39) - Winning vendor: Creative Design Studio', 
    timestamp: '2025-04-28T09:30:00Z', 
    ip: '192.168.1.120' 
  },
  { 
    id: 5, 
    user: 'David Thompson', 
    action: 'User login', 
    details: 'Successful authentication', 
    timestamp: '2025-04-30T08:05:00Z', 
    ip: '192.168.1.125' 
  },
  { 
    id: 6, 
    user: 'Emma Wilson', 
    action: 'Uploaded file', 
    details: 'Added budget document to Office Furniture Procurement (T-2023-41)', 
    timestamp: '2025-04-29T14:20:00Z', 
    ip: '192.168.1.130' 
  },
  { 
    id: 7, 
    user: 'John Doe', 
    action: 'Edited tender', 
    details: 'Updated deadline for IT Infrastructure Upgrade (T-2023-42)', 
    timestamp: '2025-04-28T16:15:00Z', 
    ip: '192.168.1.105' 
  },
  { 
    id: 8, 
    user: 'Jane Smith', 
    action: 'Flagged submission', 
    details: 'Flagged Future Innovations Ltd proposal for review', 
    timestamp: '2025-04-27T13:40:00Z', 
    ip: '192.168.1.110' 
  },
  { 
    id: 9, 
    user: 'Michael Johnson', 
    action: 'User logout', 
    details: 'Session terminated', 
    timestamp: '2025-04-29T17:30:00Z', 
    ip: '192.168.1.115' 
  },
  { 
    id: 10, 
    user: 'Sarah Williams', 
    action: 'Added vendor', 
    details: 'Registered new vendor: DataSecure Solutions', 
    timestamp: '2025-04-26T10:50:00Z', 
    ip: '192.168.1.120' 
  }
];

export default function Settings() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredLogs, setFilteredLogs] = React.useState(auditLogs);
  const [userFilter, setUserFilter] = React.useState<string | null>(null);
  
  // Get unique users for filter
  const uniqueUsers = React.useMemo(() => {
    return Array.from(new Set(auditLogs.map(log => log.user)));
  }, []);
  
  // Filter logs based on search term and user filter
  React.useEffect(() => {
    const filtered = auditLogs.filter(log => {
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.user.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUser = userFilter === null || log.user === userFilter;
      
      return matchesSearch && matchesUser;
    });
    
    setFilteredLogs(filtered);
  }, [searchTerm, userFilter]);
  
  // Format timestamp to readable date and time
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Export logs as CSV
  const exportCSV = () => {
    toast({
      title: "Exporting CSV",
      description: "Preparing audit logs for download...",
    });
    
    // In a real app, this would generate and download a CSV file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Audit logs have been downloaded as CSV.",
      });
    }, 1000);
  };
  
  // Export logs as PDF
  const exportPDF = () => {
    toast({
      title: "Generating PDF",
      description: "Preparing audit logs for download...",
    });
    
    // In a real app, this would generate and download a PDF file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Audit logs have been downloaded as PDF.",
      });
    }, 1000);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setUserFilter(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage system settings and view audit logs.
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Audit Log</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportPDF}>
                  <FileDown className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={userFilter || ""}
                  onChange={(e) => setUserFilter(e.target.value || null)}
                >
                  <option value="">All Users</option>
                  {uniqueUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
                
                <Button variant="outline" onClick={resetFilters}>
                  <Filter className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No audit logs found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.ip}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
