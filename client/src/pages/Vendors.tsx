import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CircleCheck, Lock, CircleDot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for vendors
const vendors = [
  { 
    id: 1, 
    name: 'TechSolutions Inc.', 
    companyId: 'VSL-2023-001', 
    email: 'contact@techsolutions.com', 
    submissions: 4, 
    status: 'Active',
    verified: true
  },
  { 
    id: 2, 
    name: 'Creative Design Studio', 
    companyId: 'VSL-2023-002', 
    email: 'info@creativedesign.com', 
    submissions: 2, 
    status: 'Active',
    verified: true
  },
  { 
    id: 3, 
    name: 'Global Consulting Group', 
    companyId: 'VSL-2023-003', 
    email: 'office@gcgroup.com', 
    submissions: 0, 
    status: 'Active',
    verified: false
  },
  { 
    id: 4, 
    name: 'Future Innovations Ltd', 
    companyId: 'VSL-2023-004', 
    email: 'business@futureinnovations.co', 
    submissions: 1, 
    status: 'Blocked',
    verified: false
  },
  { 
    id: 5, 
    name: 'SmartBuild Construction', 
    companyId: 'VSL-2023-005', 
    email: 'projects@smartbuild.com', 
    submissions: 3, 
    status: 'Active',
    verified: true
  },
  { 
    id: 6, 
    name: 'DataSecure Solutions', 
    companyId: 'VSL-2023-006', 
    email: 'security@datasecure.com', 
    submissions: 2, 
    status: 'Active',
    verified: true
  },
  { 
    id: 7, 
    name: 'EcoFriendly Materials', 
    companyId: 'VSL-2023-007', 
    email: 'sales@ecofriendly.com', 
    submissions: 1, 
    status: 'Active',
    verified: false
  },
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Active' | 'Blocked'>('All');
  const [vendorList, setVendorList] = React.useState(vendors);

  // Filter vendors based on search term and status filter
  React.useEffect(() => {
    const filtered = vendors.filter(vendor => {
      const matchesSearch = 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vendor.companyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setVendorList(filtered);
  }, [searchTerm, statusFilter]);

  // Toggle vendor status (Active/Blocked)
  const toggleStatus = (id: number) => {
    setVendorList(currentList => 
      currentList.map(vendor => 
        vendor.id === id 
          ? { ...vendor, status: vendor.status === 'Active' ? 'Blocked' : 'Active' } 
          : vendor
      )
    );
  };

  // Toggle vendor verification status
  const toggleVerified = (id: number) => {
    setVendorList(currentList => 
      currentList.map(vendor => 
        vendor.id === id 
          ? { ...vendor, verified: !vendor.verified } 
          : vendor
      )
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all registered vendors in the procurement system.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Registered Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors by name, ID or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === 'All' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('All')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'Active' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('Active')}
                >
                  Active
                </Button>
                <Button 
                  variant={statusFilter === 'Blocked' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('Blocked')}
                >
                  Blocked
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Company ID</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead className="text-center">Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No vendors found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorList.map((vendor, idx) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>{vendor.companyId}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell className="text-center">
                          {vendor.submissions > 0 ? (
                            <Badge variant="outline">{vendor.submissions}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={vendor.status === 'Active' ? 'secondary' : 'destructive'}
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vendor.verified ? (
                            <CircleCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <CircleDot className="h-4 w-4 text-gray-300" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleVerified(vendor.id)}
                            >
                              {vendor.verified ? 'Unverify' : 'Verify'}
                            </Button>
                            
                            <Button
                              variant={vendor.status === 'Active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleStatus(vendor.id)}
                            >
                              {vendor.status === 'Active' ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Block
                                </>
                              ) : (
                                'Unblock'
                              )}
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
    </MainLayout>
  );
}
