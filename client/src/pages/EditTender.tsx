import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { tenderApi, evaluatorApi } from '@/lib/api-client';

const EditTender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [allEvaluators, setAllEvaluators] = useState<any[]>([]);
  const [assignedEvaluators, setAssignedEvaluators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await tenderApi.getTenderById(id!);
        setAssignedEvaluators(res.data.assignedEvaluators || []);
        const evalRes = await evaluatorApi.getEvaluators();
        setAllEvaluators(evalRes.data || []);
      } catch {
        toast({ title: 'Error', description: 'Failed to load evaluators', variant: 'destructive' });
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      await tenderApi.updateTender(id!, { assignedEvaluators: assignedEvaluators.map(ev => ev._id) });
      toast({ title: 'Success', description: 'Evaluators updated' });
      navigate('/tenders');
    } catch {
      toast({ title: 'Error', description: 'Failed to update evaluators', variant: 'destructive' });
    }
  };

  const handleAddEvaluator = (value: string) => {
    const ev = allEvaluators.find(e => e._id === value);
    if (ev && !assignedEvaluators.some(a => a._id === value)) {
      setAssignedEvaluators([...assignedEvaluators, ev]);
    }
  };

  const handleRemoveEvaluator = (value: string) => {
    setAssignedEvaluators(assignedEvaluators.filter(e => e._id !== value));
  };

  return (
    <MainLayout>
      <form onSubmit={e => e.preventDefault()} className="container mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/tenders')}>Go Back</Button>
          <Button onClick={handleSave}><Save className="mr-2" /> Save Changes</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Assigned Evaluators</CardTitle>
            <CardDescription>Manage the evaluators assigned to this tender</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedEvaluators.map(ev => (
              <div key={ev._id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <p className="font-medium text-sm">{ev.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveEvaluator(ev._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Select onValueChange={handleAddEvaluator}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add Evaluator" />
              </SelectTrigger>
              <SelectContent>
                {allEvaluators.filter(e => !assignedEvaluators.some(a => a._id === e._id)).map(ev => (
                  <SelectItem key={ev._id} value={ev._id}>{ev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </form>
    </MainLayout>
  );
};

export default EditTender;
