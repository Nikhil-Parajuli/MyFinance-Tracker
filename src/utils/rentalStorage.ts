import { RoomRental, RentalPayment } from '../types/rental';

const STORAGE_KEYS = {
  ROOMS: 'myfinance_rooms',
  PAYMENTS: 'myfinance_rental_payments',
};

export const saveRooms = (rooms: RoomRental[]): void => {
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
};

export const getRooms = (): RoomRental[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ROOMS);
  return stored ? JSON.parse(stored) : [];
};

export const saveRentalPayments = (payments: RentalPayment[]): void => {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

export const getRentalPayments = (): RentalPayment[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return stored ? JSON.parse(stored) : [];
};