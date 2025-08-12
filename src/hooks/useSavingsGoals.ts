import { useState, useEffect } from 'react';
import { SavingsGoal } from '../types';
import { savingsGoalsService } from '../services/database';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch savings goals from database
  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const fetchedGoals = await savingsGoalsService.getAll();
      setGoals(fetchedGoals);
      setError(null);
    } catch (err) {
      setError('Failed to fetch savings goals from database');
      console.error('Error fetching savings goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newGoal = await savingsGoalsService.create(goal);
      setGoals(prev => [...prev, newGoal]);
      setError(null);
    } catch (err) {
      console.error('Error adding savings goal:', err);
      setError('Failed to add savings goal to database');
      throw err;
    }
  };

  const updateGoal = async (updatedGoal: SavingsGoal) => {
    try {
      const updated = await savingsGoalsService.update(updatedGoal.id, updatedGoal);
      setGoals(prev =>
        prev.map((goal) => (goal.id === updatedGoal.id ? updated : goal))
      );
      setError(null);
    } catch (err) {
      console.error('Error updating savings goal:', err);
      setError('Failed to update savings goal in database');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await savingsGoalsService.delete(id);
      setGoals(prev => prev.filter((goal) => goal.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting savings goal:', err);
      setError('Failed to delete savings goal from database');
      throw err;
    }
  };

  // Helper function to add money to a goal
  const addToGoal = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedGoal = {
      ...goal,
      current_amount: (goal.current_amount || 0) + amount,
    };

    await updateGoal(updatedGoal);
  };

  // Helper function to get total saved across all goals
  const getTotalSaved = () => {
    return goals.reduce((total, goal) => total + (goal.current_amount || 0), 0);
  };

  // Helper function to get total target across all goals
  const getTotalTarget = () => {
    return goals.reduce((total, goal) => total + goal.target_amount, 0);
  };

  // Helper function to get overall progress percentage
  const getOverallProgress = () => {
    const totalTarget = getTotalTarget();
    if (totalTarget === 0) return 0;
    return (getTotalSaved() / totalTarget) * 100;
  };

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    refreshGoals: fetchGoals,
    getTotalSaved,
    getTotalTarget,
    getOverallProgress,
  };
}