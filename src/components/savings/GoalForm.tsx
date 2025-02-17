import React, { useState } from 'react';
import { SavingsGoal, Currency } from '../../types';
import { PlusCircle } from 'lucide-react';
import DatePicker from '../common/DatePicker';

interface GoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, 'id'>) => void;
  onCancel?: () => void;
  initialData?: SavingsGoal;
}

export default function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(initialData?.currentAmount.toString() || '');
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || 'NPR');
  const [deadline, setDeadline] = useState(initialData?.deadline || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      currency,
      deadline,
    });
    
    if (!initialData) {
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setCurrency('NPR');
      setDeadline(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., New Car"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="NPR">NPR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount</label>
            <input
              type="number"
              required
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
          <DatePicker date={deadline} onChange={setDeadline} />
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {initialData ? 'Update Goal' : 'Add Goal'}
        </button>
      </div>
    </form>
  );
}