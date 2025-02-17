import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import NepaliDate from 'nepali-date-converter';

export interface DateDisplay {
  englishDate: string;
  nepaliDate: string;
  displayLabel: string;
}

export const formatDate = (date: Date | string): DateDisplay => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const nepaliDate = new NepaliDate(dateObj);

  let displayLabel = format(dateObj, 'MMM d, yyyy');
  if (isToday(dateObj)) {
    displayLabel = 'Today';
  } else if (isYesterday(dateObj)) {
    displayLabel = 'Yesterday';
  }

  return {
    englishDate: format(dateObj, 'yyyy-MM-dd'),
    nepaliDate: nepaliDate.format('YYYY-MM-DD'),
    displayLabel
  };
};

export const groupByDate = <T extends { date: string }>(items: T[]): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = new Date(item.date);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortDates = (dates: string[]): string[] => {
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};

export const convertToNepaliDate = (englishDate: string): string => {
  const date = new Date(englishDate);
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('YYYY-MM-DD');
};

export const convertToEnglishDate = (nepaliDate: string): string => {
  const [year, month, day] = nepaliDate.split('-').map(Number);
  const nDate = new NepaliDate(year, month - 1, day);
  const englishDate = nDate.toJsDate();
  return format(englishDate, 'yyyy-MM-dd');
};