import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from '@/components/tenders/FileUploader';
import { 
  FilePlus, 
  Trash2, 
  Save, 
  Calendar, 
  Tag, 
  Users, 
  ClipboardList 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TenderData {
  id: string;
  title: string;
  reference: string;
  description: string;
  category: string;
  deadline: Date;
  budget: string;
  requiresNDA: boolean;
  documents: { name: string; size: string; type: string }[];
  evaluators: string[];
}

const mockCategories = ['IT', 'Construction', 'Supply', 'Services'];

const EditTender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(mockCategories[0]);
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [budget, setBudget] = useState('');
  const [requiresNDA, setRequiresNDA] = useState(false);
  const [documents, setDocuments] = useState<{ name: string; size: string; type: string }[]>([]);
  const [evaluators, setEvaluators] = useState<string[]>([]);
  const [categories, setCategories] = useState(mockCategories);
  // Front-end only: full list of evaluators for selection
  const allEvaluatorsList = ['John Smith', 'Emma Wilson', 'Michael Brown', 'Anna Smith'];
  // Filter out already assigned evaluators
  const availableEvaluatorsOptions = allEvaluatorsList.filter(name => !evaluators.includes(name));

  useEffect(() => {
    // Mock fetch - replace with actual API call
    const mockTenderData: TenderData = {
      id: 'T-2023-42',
      title: 'Office Equipment Procurement',
      reference: 'REF-2023-42',
      description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
      category: 'IT',
      deadline: new Date('2025-05-30'),
      budget: '$50,000',
      requiresNDA: true,
      documents: [
        { name: 'Tender Specification Document', size: '2.4 MB', type: 'pdf' },
        { name: 'Equipment Requirements', size: '1.8 MB', type: 'docx' },
      ],
      evaluators: ['John Smith', 'Emma Wilson'],
    };

    setTitle(mockTenderData.title);
    setReference(mockTenderData.reference);
    setDescription(mockTenderData.description);
    setCategory(mockTenderData.category);
    setDeadline(mockTenderData.deadline);
    setBudget(mockTenderData.budget);
    setRequiresNDA(mockTenderData.requiresNDA);
    setDocuments(mockTenderData.documents);
    setEvaluators(mockTenderData.evaluators);
  }, [id]);

  const handleSave = () => {
    // Mock save - replace with actual API call
    toast({
      title: "Tender Updated",
      description: "Your tender has been successfully updated.",
    });
    navigate('/tenders');
  };

  const handleFileUpload = (files: File[]) => {
    const newDocuments = files.map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type.split('/')[1] || 'file',
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleAddEvaluator = () => {
    // Mock add evaluator logic
    setEvaluators([...evaluators, 'New Evaluator']);
  };

  const handleRemoveEvaluator = (index: number) => {
    const newEvaluators = [...evaluators];
    newEvaluators.splice(index, 1);
    setEvaluators(newEvaluators);
  };

  return (
    <MainLayout>
      <form onSubmit={(e) => e.preventDefault()} className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/tenders')} className="mb-2">
            Go Back
          </Button>
          
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold">Edit Tender</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge>Draft</Badge>
                <Badge variant="outline">IT</Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Evaluators</CardTitle>
                <CardDescription>
                  Manage the evaluators assigned to this tender
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluators.map((evaluator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <p className="font-medium text-sm">{evaluator}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveEvaluator(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
                <Select onValueChange={(value) => setEvaluators([...evaluators, value])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add Evaluator" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEvaluatorsOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tender Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge>Draft</Badge>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <Badge variant="outline">{category}</Badge>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Evaluators</div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{evaluators.length}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Requires NDA</div>
                  <div>{requiresNDA ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
              <CardContent className="border-t pt-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">IT</Badge>
                    <Badge variant="secondary">Equipment</Badge>
                    <Badge variant="secondary">Urgent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </MainLayout>
  );
};

export default EditTender;
