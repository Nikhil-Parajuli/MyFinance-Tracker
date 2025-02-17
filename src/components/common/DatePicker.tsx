import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import { convertToNepaliDate, convertToEnglishDate } from '../../utils/dateUtils';

interface DatePickerProps {
  date: string;
  onChange: (date: string) => void;
  showNepaliDate?: boolean;
}

export default function DatePicker({ date, onChange, showNepaliDate = true }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNepali, setIsNepali] = useState(false);
  
  const toggleCalendar = () => setIsOpen(!isOpen);
  const toggleDateFormat = () => setIsNepali(!isNepali);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const displayDate = isNepali ? convertToNepaliDate(date) : date;

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={toggleCalendar}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {displayDate}
        </button>
        {showNepaliDate && (
          <button
            type="button"
            onClick={toggleDateFormat}
            className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isNepali ? 'Show English' : 'Show Nepali'}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg p-4">
          <DayPicker
            mode="single"
            selected={new Date(date)}
            onSelect={(d) => handleDateSelect(d)}
            className="border-0"
          />
        </div>
      )}
    </div>
  );
}