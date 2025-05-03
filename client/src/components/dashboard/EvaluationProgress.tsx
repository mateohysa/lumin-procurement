
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sample data for evaluations
const evaluations = [
  {
    id: 'E-101',
    tender: 'Office Furniture Procurement',
    evaluators: [
      { name: 'John Smith', avatar: 'JS', completed: true },
      { name: 'Emma Wilson', avatar: 'EW', completed: true },
      { name: 'Michael Brown', avatar: 'MB', completed: false },
      { name: 'Sarah Davis', avatar: 'SD', completed: false },
    ],
    completion: 50,
    dueDate: '2025-05-12'
  },
  {
    id: 'E-102',
    tender: 'IT Services Consultation',
    evaluators: [
      { name: 'John Smith', avatar: 'JS', completed: true },
      { name: 'Emma Wilson', avatar: 'EW', completed: true },
      { name: 'Michael Brown', avatar: 'MB', completed: true },
    ],
    completion: 100,
    dueDate: '2025-05-08'
  },
  {
    id: 'E-103',
    tender: 'Marketing Materials Design',
    evaluators: [
      { name: 'Sarah Davis', avatar: 'SD', completed: true },
      { name: 'Emma Wilson', avatar: 'EW', completed: false },
      { name: 'Michael Brown', avatar: 'MB', completed: false },
    ],
    completion: 33,
    dueDate: '2025-05-15'
  }
];

export function EvaluationProgress() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Evaluation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">{evaluation.id}</div>
                  <div className="font-medium">{evaluation.tender}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(evaluation.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Progress value={evaluation.completion} className="h-2 w-4/5" />
                <span className="text-sm font-medium">{evaluation.completion}%</span>
              </div>

              <div className="flex -space-x-2">
                <TooltipProvider>
                  {evaluation.evaluators.map((evaluator, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger>
                        <Avatar className={`h-8 w-8 border-2 ${evaluator.completed ? 'border-green-500' : 'border-gray-200'}`}>
                          <AvatarFallback className={evaluator.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                            {evaluator.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{evaluator.name} {evaluator.completed ? '(Completed)' : '(Pending)'}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
