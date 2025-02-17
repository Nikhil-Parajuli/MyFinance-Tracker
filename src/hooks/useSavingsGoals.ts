import { useState, useEffect } from 'react';
import { SavingsGoal } from '../types';
import { getSavingsGoals, saveSavingsGoals } from '../utils/storage';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    setGoals(getSavingsGoals());
  }, []);

  const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  const updateGoal = (updatedGoal: SavingsGoal) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    saveSavingsGoals(updatedGoals);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}