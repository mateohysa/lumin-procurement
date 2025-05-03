
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download,
  SendHorizonal,
  Upload,
  InfoIcon,
  Calendar,
  Building,
  Timer,
  Eye,
  Check,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock tender data
const tenders = [
  {
    id: 1,
    title: 'Office Equipment Procurement',
    description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-05-30',
    budget: '$50,000',
    organization: 'Ministry of Education',
    alreadyApplied: true
  },
  {
    id: 2,
    title: 'IT Services Procurement',
    description: 'Looking for a provider of IT services, including network maintenance, cybersecurity, and cloud solutions.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-15',
    budget: '$120,000',
    organization: 'Department of Health',
    alreadyApplied: false
  },
  {
    id: 3,
    title: 'Construction Services',
    description: 'Requesting bids for construction services for a new office building.',
    category: 'Construction',
    status: 'Open',
    deadline: '2025-07-01',
    budget: '$2,500,000',
    organization: 'City Council',
    alreadyApplied: false
  },
  {
    id: 4,
    title: 'Office Supplies Contract',
    description: 'Recurring supply of office materials including paper, pens, and other stationery items.',
    category: 'Supply',
    status: 'Open',
    deadline: '2025-05-20',
    budget: '$15,000',
    organization: 'Ministry of Finance',
    alreadyApplied: true
  },
  {
    id: 5,
    title: 'Networking Equipment',
    description: 'Procurement of routers, switches, and other networking equipment for a new data center.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-10',
    budget: '$85,000',
    organization: 'Technology Department',
    alreadyApplied: false
  },
  {
    id: 6,
    title: 'Building Renovation',
    description: 'Renovation of an existing government building, including structural repairs and interior updates.',
    category: 'Construction',
    status: 'Open',
    deadline: '2025-08-15',
    budget: '$750,000',
    organization: 'Public Works Department',
    alreadyApplied: false
  },
];

const AvailableTenders = () => {
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor';

  const filteredTendersByCategory = (category: string) => {
    if (category === 'all') return tenders;
    return tenders.filter(tender => tender.category.toLowerCase() === category.toLowerCase());
  };

  const renderTenderCard = (tender: any) => (
    <Card key={tender.id} className="flex flex-col">
      <CardHeader>
        <CardTitle>{tender.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {tender.description}
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Deadline:</span> {tender.deadline}
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Organization:</span> {tender.organization}
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Budget:</span> {tender.budget}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{tender.category}</Badge>
          <Badge>{tender.status}</Badge>
          {tender.alreadyApplied && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-3 w-3 mr-1" /> Applied
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <Button variant="ghost" asChild>
          <Link to={`/tenders/${tender.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
        {isVendor && (
          tender.alreadyApplied ? (
            <Button variant="outline" disabled className="cursor-not-allowed">
              <Lock className="mr-2 h-4 w-4" />
              Already Applied
            </Button>
          ) : (
            <Button asChild>
              <Link to={`/apply-tender/${tender.id}`}>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Apply
              </Link>
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Available Tenders</h1>
          <p className="text-muted-foreground">Browse and apply for open tenders.</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tenders</TabsTrigger>
            <TabsTrigger value="it">IT Services</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="supply">Supply Chain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByCategory('all').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="it" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByCategory('it').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="construction" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByCategory('construction').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="supply" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByCategory('supply').map(renderTenderCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AvailableTenders;
