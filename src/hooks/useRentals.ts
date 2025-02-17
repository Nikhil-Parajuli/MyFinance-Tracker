import { useState, useEffect } from 'react';
import { RoomRental, RentalPayment } from '../types/rental';
import { saveRooms, getRooms, saveRentalPayments, getRentalPayments } from '../utils/rentalStorage';

export function useRentals() {
  const [rooms, setRooms] = useState<RoomRental[]>([]);
  const [payments, setPayments] = useState<RentalPayment[]>([]);

  useEffect(() => {
    setRooms(getRooms());
    setPayments(getRentalPayments());
  }, []);

  const addRoom = (room: Omit<RoomRental, 'id'>) => {
    const newRoom: RoomRental = {
      ...room,
      id: crypto.randomUUID(),
    };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const updateRoom = (updatedRoom: RoomRental) => {
    const updatedRooms = rooms.map((room) =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const deleteRoom = (id: string) => {
    const updatedRooms = rooms.filter(room => room.id !== id);
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const addPayment = (payment: Omit<RentalPayment, 'id'>) => {
    const newPayment: RentalPayment = {
      ...payment,
      id: crypto.randomUUID(),
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    saveRentalPayments(updatedPayments);
  };

  const updatePayment = (updatedPayment: RentalPayment) => {
    const updatedPayments = payments.map((payment) =>
      payment.id === updatedPayment.id ? updatedPayment : payment
    );
    setPayments(updatedPayments);
    saveRentalPayments(updatedPayments);
  };

  const deletePayment = (id: string) => {
    const updatedPayments = payments.filter(payment => payment.id !== id);
    setPayments(updatedPayments);
    saveRentalPayments(updatedPayments);
  };

  return {
    rooms,
    payments,
    addRoom,
    updateRoom,
    deleteRoom,
    addPayment,
    updatePayment,
    deletePayment,
  };
}