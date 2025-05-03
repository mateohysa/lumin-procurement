import React, { useState, useEffect } from 'react';
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
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { tenderApi } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

const AvailableTenders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isVendor = user?.role === 'vendor';
  
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        const response = await tenderApi.getOpenTenders();
        console.log('API Response:', response); // Debug: Log the full response
        
        // Fix: Extract tenders directly from response.data, not response.data.data
        const tendersData = response.data || [];
        console.log('Tenders data:', tendersData); // Debug: Log the tenders data
        
        // Map the data to ensure it has the expected fields
        const formattedTenders = tendersData.map(tender => ({
          id: tender._id,
          title: tender.title || 'Untitled Tender',
          description: tender.description || 'No description provided',
          category: tender.category || 'Uncategorized',
          status: tender.status || 'Unknown',
          deadline: tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'No deadline',
          budget: tender.budget ? `$${tender.budget.toLocaleString()}` : 'Budget not specified',
          // Use createdBy ID as organization for now
          organization: tender.organization || 'Organization not specified',
          // Default to false, implement proper check in the future
          alreadyApplied: tender.alreadyApplied || false
        }));
        
        console.log('Formatted tenders:', formattedTenders); // Debug: Log formatted data
        setTenders(formattedTenders);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tenders:', err);
        setError('Failed to load tenders. Please try again later.');
        toast({
          title: 'Error',
          description: 'Could not load available tenders',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [toast]);

  const filteredTendersByCategory = (category: string) => {
    if (category === 'all') return tenders;
    return tenders.filter(tender => tender.category && tender.category.toLowerCase() === category.toLowerCase());
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

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            {error}
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <InfoIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg font-medium">No open tenders available</p>
            <p className="text-sm text-muted-foreground">Check back later for new opportunities</p>
          </div>
        ) : (
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
        )}
      </div>
    </MainLayout>
  );
};

export default AvailableTenders;
