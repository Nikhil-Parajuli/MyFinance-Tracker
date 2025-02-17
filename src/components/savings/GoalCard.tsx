import React from 'react';
import { SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { PiggyBank, Calendar, Target } from 'lucide-react';

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const deadline = new Date(goal.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <PiggyBank className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Amount</p>
            <p className="text-lg font-semibold text-indigo-600">
              {formatCurrency(goal.currentAmount, goal.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Target Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(goal.targetAmount, goal.currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {daysLeft} days left
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Target className="w-4 h-4 mr-2" />
            {formatCurrency(remaining, goal.currency)} to go
          </div>
        </div>
      </div>
    </div>
  );
}