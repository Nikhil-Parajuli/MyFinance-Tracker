import { useState, useEffect } from 'react';
import { RoomRental, RentalPayment } from '../types';
import { roomRentalsService, rentalPaymentsService } from '../services/database';

export function useRentals() {
  const [rooms, setRooms] = useState<RoomRental[]>([]);
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rooms and payments from database
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedRooms, fetchedPayments] = await Promise.all([
        roomRentalsService.getAll(),
        rentalPaymentsService.getAll()
      ]);
      
      setRooms(fetchedRooms);
      setPayments(fetchedPayments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rental data from database');
      console.error('Error fetching rental data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Room operations
  const addRoom = async (room: Omit<RoomRental, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newRoom = await roomRentalsService.create(room);
      setRooms(prev => [...prev, newRoom]);
      setError(null);
    } catch (err) {
      console.error('Error adding room:', err);
      setError('Failed to add room to database');
      throw err;
    }
  };

  const updateRoom = async (updatedRoom: RoomRental) => {
    try {
      const updated = await roomRentalsService.update(updatedRoom.id, updatedRoom);
      setRooms(prev =>
        prev.map((room) => (room.id === updatedRoom.id ? updated : room))
      );
      setError(null);
    } catch (err) {
      console.error('Error updating room:', err);
      setError('Failed to update room in database');
      throw err;
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await roomRentalsService.delete(id);
      setRooms(prev => prev.filter(room => room.id !== id));
      // Also remove related payments
      setPayments(prev => prev.filter(payment => payment.rental_id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room from database');
      throw err;
    }
  };

  // Payment operations
  const addPayment = async (payment: Omit<RentalPayment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPayment = await rentalPaymentsService.create(payment);
      setPayments(prev => [...prev, newPayment]);
      setError(null);
    } catch (err) {
      console.error('Error adding payment:', err);
      setError('Failed to add payment to database');
      throw err;
    }
  };

  const updatePayment = async (updatedPayment: RentalPayment) => {
    try {
      const updated = await rentalPaymentsService.update(updatedPayment.id, updatedPayment);
      setPayments(prev =>
        prev.map((payment) => (payment.id === updatedPayment.id ? updated : payment))
      );
      setError(null);
    } catch (err) {
      console.error('Error updating payment:', err);
      setError('Failed to update payment in database');
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await rentalPaymentsService.delete(id);
      setPayments(prev => prev.filter(payment => payment.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Failed to delete payment from database');
      throw err;
    }
  };

  // Helper functions
  const getPaymentsByRoomId = (roomId: string) => {
    return payments.filter(payment => payment.rental_id === roomId);
  };

  const getTotalRentalIncome = () => {
    return payments.reduce((total, payment) => total + payment.total_amount, 0);
  };

  const getMonthlyIncome = (month: string) => {
    return payments
      .filter(payment => payment.month === month)
      .reduce((total, payment) => total + payment.total_amount, 0);
  };

  const getOccupiedRooms = () => {
    return rooms.filter(room => room.status === 'occupied');
  };

  const getVacantRooms = () => {
    return rooms.filter(room => room.status === 'vacant');
  };

  return {
    rooms,
    payments,
    isLoading,
    error,
    addRoom,
    updateRoom,
    deleteRoom,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsByRoomId,
    getTotalRentalIncome,
    getMonthlyIncome,
    getOccupiedRooms,
    getVacantRooms,
    refreshData: fetchData,
  };
}