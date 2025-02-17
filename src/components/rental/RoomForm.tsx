import React, { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import { RoomRental } from '../../types/rental';

interface RoomFormProps {
  onSubmit: (room: Omit<RoomRental, 'id'>) => void;
}

export default function RoomForm({ onSubmit }: RoomFormProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      roomNumber,
      tenantName,
      rentAmount: parseFloat(rentAmount),
      currency,
      startDate: new Date().toISOString(),
      status: 'occupied',
    });
    // Reset form
    setRoomNumber('');
    setTenantName('');
    setRentAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            type="text"
            required
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
          <input
            type="text"
            required
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tenant name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              required
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0.00"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'NPR' | 'USD')}
                className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="NPR">NPR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </button>
      </div>
    </form>
  );
}