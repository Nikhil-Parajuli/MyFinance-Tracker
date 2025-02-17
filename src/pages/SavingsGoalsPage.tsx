import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SavingsGoal } from '../types';
import GoalCard from '../components/savings/GoalCard';
import GoalForm from '../components/savings/GoalForm';
import { useSavingsGoals } from '../hooks/useSavingsGoals';

export default function SavingsGoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowAddForm(true);
  };

  const handleSubmit = (goal: Omit<SavingsGoal, 'id'>) => {
    if (editingGoal) {
      updateGoal({ ...goal, id: editingGoal.id });
      setEditingGoal(null);
    } else {
      addGoal(goal);
    }
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </button>
      </div>

      {showAddForm && (
        <GoalForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEdit}
            onDelete={deleteGoal}
          />
        ))}
      </div>

      {goals.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No savings goals yet</h3>
          <p className="text-gray-500 mb-4">Start tracking your savings by adding a new goal</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Goal
          </button>
        </div>
      )}
    </div>
  );
}