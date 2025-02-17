import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { RoomRental } from '../../types/rental';

interface RoomActionsProps {
  room: RoomRental;
  onEdit: (room: RoomRental) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'occupied' | 'vacant') => void;
}

export default function RoomActions({ room, onEdit, onDelete, onStatusChange }: RoomActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoom, setEditedRoom] = useState(room);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editedRoom);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              type="text"
              value={editedRoom.roomNumber}
              onChange={(e) => setEditedRoom({ ...editedRoom, roomNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
            <input
              type="text"
              value={editedRoom.tenantName}
              onChange={(e) => setEditedRoom({ ...editedRoom, tenantName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
            <input
              type="number"
              value={editedRoom.rentAmount}
              onChange={(e) => setEditedRoom({ ...editedRoom, rentAmount: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editedRoom.status}
              onChange={(e) => setEditedRoom({ ...editedRoom, status: e.target.value as 'occupied' | 'vacant' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="occupied">Occupied</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setIsEditing(true)}
        className="text-indigo-600 hover:text-indigo-900"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(room.id)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <select
        value={room.status}
        onChange={(e) => onStatusChange(room.id, e.target.value as 'occupied' | 'vacant')}
        className="ml-2 text-sm border-gray-300 rounded-md"
      >
        <option value="occupied">Occupied</option>
        <option value="vacant">Vacant</option>
      </select>
    </div>
  );
}