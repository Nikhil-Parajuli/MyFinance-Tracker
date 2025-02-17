import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { RoomRental, DEFAULT_UTILITY_RATES } from '../../types/rental';

interface PaymentFormProps {
  room: RoomRental;
  onSubmit: (payment: any) => void;
  utilityRates?: { electricity: number; water: number };
}

export default function PaymentForm({ room, onSubmit, utilityRates = DEFAULT_UTILITY_RATES }: PaymentFormProps) {
  const [previousElectricityReading, setPreviousElectricityReading] = useState('');
  const [currentElectricityReading, setCurrentElectricityReading] = useState('');
  const [previousWaterReading, setPreviousWaterReading] = useState('');
  const [currentWaterReading, setCurrentWaterReading] = useState('');
  const [electricityRate, setElectricityRate] = useState(utilityRates.electricity.toString());
  const [waterRate, setWaterRate] = useState(utilityRates.water.toString());
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');

  const calculateBills = () => {
    const electricityUnits = parseFloat(currentElectricityReading) - parseFloat(previousElectricityReading);
    const waterUnits = parseFloat(currentWaterReading) - parseFloat(previousWaterReading);
    
    const electricityAmount = electricityUnits * parseFloat(electricityRate);
    const waterAmount = waterUnits * parseFloat(waterRate);
    const additional = parseFloat(additionalCharges) || 0;

    return {
      electricity: {
        units: electricityUnits,
        rate: parseFloat(electricityRate),
        amount: electricityAmount
      },
      water: {
        units: waterUnits,
        rate: parseFloat(waterRate),
        amount: waterAmount
      },
      additional,
      total: room.rentAmount + electricityAmount + waterAmount + additional
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bills = calculateBills();
    
    onSubmit({
      rentalId: room.id,
      date: new Date().toISOString(),
      month: new Date().toISOString().slice(0, 7),
      rentAmount: room.rentAmount,
      electricityReading: {
        previous: parseFloat(previousElectricityReading),
        current: parseFloat(currentElectricityReading),
        unitsConsumed: bills.electricity.units,
        ratePerUnit: bills.electricity.rate,
        amount: bills.electricity.amount
      },
      waterBill: {
        previous: parseFloat(previousWaterReading),
        current: parseFloat(currentWaterReading),
        unitsConsumed: bills.water.units,
        ratePerUnit: bills.water.rate,
        amount: bills.water.amount
      },
      additionalCharges: additionalCharges ? [{
        description: additionalDescription,
        amount: bills.additional
      }] : [],
      totalAmount: bills.total,
      status: 'pending'
    });

    // Reset form
    setPreviousElectricityReading('');
    setCurrentElectricityReading('');
    setPreviousWaterReading('');
    setCurrentWaterReading('');
    setAdditionalCharges('');
    setAdditionalDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900">Record Payment for Room {room.roomNumber}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Electricity Reading</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Previous</label>
              <input
                type="number"
                required
                value={previousElectricityReading}
                onChange={(e) => setPreviousElectricityReading(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current</label>
              <input
                type="number"
                required
                value={currentElectricityReading}
                onChange={(e) => setCurrentElectricityReading(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rate per Unit</label>
              <input
                type="number"
                required
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Water Reading</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Previous</label>
              <input
                type="number"
                required
                value={previousWaterReading}
                onChange={(e) => setPreviousWaterReading(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current</label>
              <input
                type="number"
                required
                value={currentWaterReading}
                onChange={(e) => setCurrentWaterReading(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rate per Unit</label>
              <input
                type="number"
                required
                value={waterRate}
                onChange={(e) => setWaterRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Charges</label>
          <input
            type="number"
            value={additionalCharges}
            onChange={(e) => setAdditionalCharges(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={additionalDescription}
            onChange={(e) => setAdditionalDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Maintenance"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate & Save
        </button>
      </div>
    </form>
  );
}