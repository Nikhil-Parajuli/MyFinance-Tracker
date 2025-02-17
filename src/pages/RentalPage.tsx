import React, { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import { useRentals } from '../hooks/useRentals';
import RoomForm from '../components/rental/RoomForm';
import PaymentForm from '../components/rental/PaymentForm';
import PaymentHistory from '../components/rental/PaymentHistory';
import RentalSummary from '../components/rental/RentalSummary';
import RoomActions from '../components/rental/RoomActions';
import { RoomRental } from '../types/rental';

export default function RentalPage() {
  const { rooms, payments, addRoom, updateRoom, addPayment, updatePayment, deleteRoom, deletePayment } = useRentals();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomRental | null>(null);

  const handleStatusChange = (id: string, status: 'occupied' | 'vacant') => {
    const room = rooms.find(r => r.id === id);
    if (room) {
      updateRoom({ ...room, status });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Kotha Vada (Room Rental)</h1>
        <button
          onClick={() => setShowAddRoom(!showAddRoom)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </button>
      </div>

      <RentalSummary rooms={rooms} payments={payments} />

      {showAddRoom && (
        <div className="mt-4">
          <RoomForm onSubmit={(room) => {
            addRoom(room);
            setShowAddRoom(false);
          }} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Home className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Room {room.roomNumber}
                </h3>
              </div>
              <RoomActions
                room={room}
                onEdit={updateRoom}
                onDelete={deleteRoom}
                onStatusChange={handleStatusChange}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tenant: {room.tenantName}</p>
              <p className="text-sm text-gray-600">Rent: {room.currency} {room.rentAmount}</p>
              <p className="text-sm text-gray-600">Status: {room.status}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md"
              >
                {selectedRoom?.id === room.id ? 'Cancel' : 'Record Payment'}
              </button>
            </div>
            {selectedRoom?.id === room.id && (
              <PaymentForm
                room={room}
                onSubmit={(payment) => {
                  addPayment(payment);
                  setSelectedRoom(null);
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PaymentHistory
          payments={payments}
          onUpdatePayment={updatePayment}
          onDeletePayment={deletePayment}
        />
      </div>
    </div>
  );
}