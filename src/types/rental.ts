export interface RoomRental {
  id: string;
  roomNumber: string;
  tenantName: string;
  rentAmount: number;
  currency: 'NPR' | 'USD';
  startDate: string;
  status: 'occupied' | 'vacant';
}

export interface UtilityRates {
  electricity: number; // per unit
  water: number; // per unit
}

export interface RentalPayment {
  id: string;
  rentalId: string;
  date: string;
  month: string; // Format: YYYY-MM
  rentAmount: number;
  electricityReading: {
    previous: number;
    current: number;
    unitsConsumed: number;
    ratePerUnit: number;
    amount: number;
  };
  waterBill: {
    previous: number;
    current: number;
    unitsConsumed: number;
    ratePerUnit: number;
    amount: number;
  };
  additionalCharges: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
}

// Default rates that can be overridden in settings
export const DEFAULT_UTILITY_RATES: UtilityRates = {
  electricity: 13, // NPR per unit
  water: 15, // NPR per unit
};