import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { RentalPayment } from '../../types/rental';
import { formatCurrency } from '../../utils/currency';
import DatePicker from '../common/DatePicker';
import { groupByDate, sortDates, formatDate } from '../../utils/dateUtils';

interface PaymentHistoryProps {
  payments: RentalPayment[];
  onUpdatePayment: (payment: RentalPayment) => void;
  onDeletePayment: (id: string) => void;
}

export default function PaymentHistory({ payments, onUpdatePayment, onDeletePayment }: PaymentHistoryProps) {
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editedPayment, setEditedPayment] = useState<RentalPayment | null>(null);

  const groupedPayments = useMemo(() => {
    const groups = groupByDate(payments);
    const sortedDates = sortDates(Object.keys(groups));
    return { groups, sortedDates };
  }, [payments]);

  const totals = useMemo(() => {
    return payments.reduce((acc, payment) => ({
      tender: acc.tender + payment.totalAmount,
      paid: acc.paid + (payment.status === 'paid' ? payment.totalAmount : 0),
      due: acc.due + (payment.status === 'pending' ? payment.totalAmount : 0),
    }), { tender: 0, paid: 0, due: 0 });
  }, [payments]);

  const handleEdit = (payment: RentalPayment) => {
    setEditingPayment(payment.id);
    setEditedPayment({ ...payment });
  };

  const handleSave = () => {
    if (editedPayment) {
      onUpdatePayment(editedPayment);
      setEditingPayment(null);
      setEditedPayment(null);
    }
  };

  const handleCancel = () => {
    setEditingPayment(null);
    setEditedPayment(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Tender</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.tender, 'NPR')}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.paid, 'NPR')}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Due Amount</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.due, 'NPR')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {groupedPayments.sortedDates.map(dateKey => {
          const dateInfo = formatDate(dateKey);
          return (
            <div key={dateKey} className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                {dateInfo.displayLabel}
                <span className="text-sm text-gray-500 ml-2">
                  ({dateInfo.nepaliDate})
                </span>
              </h4>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Room</th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Rent</th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Utilities</th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {groupedPayments.groups[dateKey].map((payment) => (
                      <tr key={payment.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {editingPayment === payment.id ? (
                            <DatePicker
                              date={editedPayment?.date || payment.date}
                              onChange={(date) =>
                                setEditedPayment(prev => prev ? { ...prev, date } : null)
                              }
                            />
                          ) : (
                            formatDate(payment.date).displayLabel
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.rentalId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                          {formatCurrency(payment.rentAmount, 'NPR')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                          {formatCurrency(
                            payment.electricityReading.amount + payment.waterBill.amount,
                            'NPR'
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(payment.totalAmount, 'NPR')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          {editingPayment === payment.id ? (
                            <select
                              value={editedPayment?.status}
                              onChange={(e) =>
                                setEditedPayment(prev =>
                                  prev ? { ...prev, status: e.target.value as 'paid' | 'pending' } : null
                                )
                              }
                              className="rounded-md border-gray-300 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                payment.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {payment.status}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                          {editingPayment === payment.id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(payment)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeletePayment(payment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}