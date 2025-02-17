import React from 'react';
import { RoomRental, RentalPayment } from '../../types/rental';
import { formatCurrency } from '../../utils/currency';
import { Home, DollarSign, Zap } from 'lucide-react';

interface RentalSummaryProps {
  rooms: RoomRental[];
  payments: RentalPayment[];
}

export default function RentalSummary({ rooms, payments }: RentalSummaryProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const calculateMonthlyStats = () => {
    const monthlyPayments = payments.filter(p => p.month === currentMonth);
    
    return {
      totalRent: monthlyPayments.reduce((sum, p) => sum + p.rentAmount, 0),
      totalUtilities: monthlyPayments.reduce(
        (sum, p) => sum + p.electricityReading.amount + p.waterBill.amount,
        0
      ),
      totalAdditional: monthlyPayments.reduce(
        (sum, p) => sum + p.additionalCharges.reduce((a, c) => a + c.amount, 0),
        0
      ),
      pendingPayments: monthlyPayments.filter(p => p.status === 'pending').length,
    };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Home className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Total Rooms</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{rooms.length}</p>
        <p className="mt-1 text-sm text-gray-500">
          {rooms.filter(r => r.status === 'occupied').length} occupied
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Monthly Income</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(stats.totalRent + stats.totalUtilities + stats.totalAdditional, 'NPR')}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {stats.pendingPayments} pending payments
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Utility Charges</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(stats.totalUtilities, 'NPR')}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          For {new Date().toLocaleString('default', { month: 'long' })}
        </p>
      </div>
    </div>
  );
}