
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserPlus, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';

// Sample data for evaluators
interface Evaluator {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
  evaluatedTenders: {
    id: string;
    title: string;
    status: 'completed' | 'in-progress';
    date: string;
  }[];
}

const sampleEvaluators: Evaluator[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    department: 'IT',
    expertise: ['Software', 'Hardware', 'Cloud Services'],
    evaluatedTenders: [
      { id: 'T-2023-01', title: 'IT Infrastructure Upgrade', status: 'completed', date: '2023-05-15' },
      { id: 'T-2023-03', title: 'Software Licensing', status: 'in-progress', date: '2023-08-20' },
    ]
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.w@example.com',
    department: 'Procurement',
    expertise: ['Office Equipment', 'Logistics', 'Services'],
    evaluatedTenders: [
      { id: 'T-2023-02', title: 'Office Furniture Procurement', status: 'completed', date: '2023-06-28' },
    ]
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    department: 'Finance',
    expertise: ['Financial Services', 'Auditing', 'Insurance'],
    evaluatedTenders: []
  },
];

const Evaluators = () => {
  const { toast } = useToast();
  const [evaluators, setEvaluators] = useState<Evaluator[]>(sampleEvaluators);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState<Evaluator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    expertise: '',
  });

  const handleAddEvaluator = () => {
    const newEvaluator: Evaluator = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      expertise: formData.expertise.split(',').map(item => item.trim()),
      evaluatedTenders: []
    };
    
    setEvaluators([...evaluators, newEvaluator]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Evaluator Added",
      description: `${newEvaluator.name} has been added as an evaluator.`,
    });
  };

  const handleEditEvaluator = () => {
    if (!selectedEvaluator) return;
    
    const updatedEvaluators = evaluators.map(evaluator => {
      if (evaluator.id === selectedEvaluator.id) {
        return {
          ...evaluator,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          expertise: formData.expertise.split(',').map(item => item.trim()),
        };
      }
      return evaluator;
    });
    
    setEvaluators(updatedEvaluators);
    setIsEditDialogOpen(false);
    resetForm();
    toast({
      title: "Evaluator Updated",
      description: `${formData.name}'s information has been updated.`,
    });
  };

  const handleDeleteEvaluator = () => {
    if (!selectedEvaluator) return;
    
    const updatedEvaluators = evaluators.filter(
      evaluator => evaluator.id !== selectedEvaluator.id
    );
    
    setEvaluators(updatedEvaluators);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Evaluator Deleted",
      description: `${selectedEvaluator.name} has been removed from evaluators.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (evaluator: Evaluator) => {
    setSelectedEvaluator(evaluator);
    setFormData({
      name: evaluator.name,
      email: evaluator.email,
      department: evaluator.department,
      expertise: evaluator.expertise.join(', '),
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (evaluator: Evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsDeleteDialogOpen(true);
  };

  const openDetailsDialog = (evaluator: Evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsDetailsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      expertise: '',
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Evaluators Management</h1>
          <p className="text-muted-foreground">Manage evaluators who assess tender submissions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Evaluator
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableCaption>List of all evaluators in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Evaluated Tenders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluators.map((evaluator) => (
              <TableRow key={evaluator.id}>
                <TableCell className="font-medium">{evaluator.name}</TableCell>
                <TableCell>{evaluator.email}</TableCell>
                <TableCell>{evaluator.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {evaluator.expertise.slice(0, 2).map((item, i) => (
                      <Badge key={i} variant="outline">{item}</Badge>
                    ))}
                    {evaluator.expertise.length > 2 && (
                      <Badge variant="outline">+{evaluator.expertise.length - 2}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{evaluator.evaluatedTenders.length}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openDetailsDialog(evaluator)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(evaluator)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(evaluator)}
                        className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Evaluator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Evaluator</DialogTitle>
            <DialogDescription>
              Enter the details of the new evaluator to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Dr. John Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john.smith@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="IT, Finance, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expertise">Expertise (comma separated)</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                placeholder="Software, Hardware, Cloud"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvaluator}>Add Evaluator</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Evaluator Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Evaluator</DialogTitle>
            <DialogDescription>
              Update the information for this evaluator.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expertise">Expertise (comma separated)</Label>
              <Input
                id="edit-expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditEvaluator}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Evaluator</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEvaluator?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEvaluator}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluator Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Evaluator Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedEvaluator?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvaluator && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p className="text-base">{selectedEvaluator.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="text-base">{selectedEvaluator.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                  <p className="text-base">{selectedEvaluator.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEvaluator.expertise.map((item, i) => (
                      <Badge key={i} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Evaluated Tenders</h3>
                {selectedEvaluator.evaluatedTenders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEvaluator.evaluatedTenders.map((tender) => (
                        <TableRow key={tender.id}>
                          <TableCell>{tender.id}</TableCell>
                          <TableCell>{tender.title}</TableCell>
                          <TableCell>
                            <Badge variant={tender.status === 'completed' ? 'default' : 'secondary'}>
                              {tender.status === 'completed' ? 'Completed' : 'In Progress'}
                            </Badge>
                          </TableCell>
                          <TableCell>{tender.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No tenders evaluated yet</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Evaluators;
