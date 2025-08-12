import React, { useState } from 'react';
import { PlusCircle, DollarSign, Tag, FileText, Users } from 'lucide-react';
import { Transaction, Currency, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('NPR');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPersonal, setIsPersonal] = useState(true);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      currency,
      type,
      category,
      sub_category: subCategory,
      description,
      is_personal: isPersonal,
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    });
    // Reset form
    setAmount('');
    setCategory('');
    setSubCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6">
        {/* Transaction Type Toggle */}
        <div className="flex space-x-2 mb-6">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
              type === 'expense'
                ? 'bg-red-50 text-red-700 border-2 border-red-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
              type === 'income'
                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-6">
          {/* Amount and Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                Amount
              </div>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-lg border-gray-200 pl-4 pr-24 h-12 text-lg focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium"
                >
                  <option value="NPR">NPR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  Category
                </div>
              </label>
              <select
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className="block w-full rounded-lg border-gray-200 h-12 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  Subcategory
                </div>
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="block w-full rounded-lg border-gray-200 h-12 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter subcategory"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                Description
              </div>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-lg border-gray-200 h-12 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="What's this transaction for?"
            />
          </div>

          {/* Personal/Family Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                Transaction Type
              </div>
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsPersonal(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isPersonal
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setIsPersonal(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  !isPersonal
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Family
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>
    </form>
  );
}