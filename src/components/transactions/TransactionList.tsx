import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import DatePicker from '../common/DatePicker';
import ConfirmDialog from '../common/ConfirmDialog';
import { groupByDate, sortDates, formatDate } from '../../utils/dateUtils';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transactionId: string | null }>({
    isOpen: false,
    transactionId: null,
  });

  const groupedTransactions = useMemo(() => {
    const groups = groupByDate(transactions);
    const sortedDates = sortDates(Object.keys(groups));
    return { groups, sortedDates };
  }, [transactions]);

  const calculateDailyTotal = (dailyTransactions: Transaction[]) => {
    return dailyTransactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc[t.currency].income += t.amount;
        } else {
          acc[t.currency].expense += t.amount;
        }
        return acc;
      },
      { NPR: { income: 0, expense: 0 }, USD: { income: 0, expense: 0 } }
    );
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction.id);
    setEditedTransaction({ ...transaction });
  };

  const handleSave = () => {
    if (editedTransaction) {
      onEdit(editedTransaction);
      setEditingTransaction(null);
      setEditedTransaction(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, transactionId: id });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.transactionId) {
      onDelete(deleteConfirm.transactionId);
    }
    setDeleteConfirm({ isOpen: false, transactionId: null });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {groupedTransactions.sortedDates.map(dateKey => {
          const dateInfo = formatDate(dateKey);
          const dailyTransactions = groupedTransactions.groups[dateKey];
          const dailyTotals = calculateDailyTotal(dailyTransactions);

          return (
            <div key={dateKey} className="space-y-4">
              <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h4 className="text-lg font-medium text-gray-900">
                  {dateInfo.displayLabel}
                  <span className="text-sm text-gray-500 ml-2">
                    ({dateInfo.nepaliDate})
                  </span>
                </h4>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Personal</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dailyTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          {transaction.isPersonal ? '✓' : ''}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transaction.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Daily Total Row */}
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={3} className="px-3 py-3 text-sm text-gray-900">
                        Daily Total
                      </td>
                      <td className="px-3 py-3 text-sm text-right">
                        <div className="space-y-1">
                          <div className="text-green-600">
                            {formatCurrency(dailyTotals.NPR.income, 'NPR')} (Income)
                          </div>
                          <div className="text-red-600">
                            {formatCurrency(dailyTotals.NPR.expense, 'NPR')} (Expense)
                          </div>
                          <div className="text-indigo-600 font-bold">
                            Net: {formatCurrency(dailyTotals.NPR.income - dailyTotals.NPR.expense, 'NPR')}
                          </div>
                        </div>
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, transactionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </>
  );
}