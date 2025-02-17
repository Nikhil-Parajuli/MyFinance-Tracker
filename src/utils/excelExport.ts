import * as XLSX from 'xlsx';
import { Transaction } from '../types';
import { formatDate } from './dateUtils';
import { formatCurrency } from './currency';

export const exportToExcel = (
  transactions: Transaction[],
  filename: string = 'transactions'
) => {
  const workbook = XLSX.utils.book_new();
  
  // Format data for Excel
  const data = transactions.map(t => ({
    'Date (English)': formatDate(t.date).englishDate,
    'Date (Nepali)': formatDate(t.date).nepaliDate,
    'Type': t.type.charAt(0).toUpperCase() + t.type.slice(1),
    'Category': t.category,
    'Sub-Category': t.subCategory,
    'Description': t.description,
    'Amount': formatCurrency(t.amount, t.currency),
    'Currency': t.currency,
    'Personal': t.isPersonal ? 'Yes' : 'No'
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // Date (English)
    { wch: 12 }, // Date (Nepali)
    { wch: 10 }, // Type
    { wch: 15 }, // Category
    { wch: 15 }, // Sub-Category
    { wch: 30 }, // Description
    { wch: 15 }, // Amount
    { wch: 8 },  // Currency
    { wch: 8 }   // Personal
  ];
  worksheet['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Generate Excel file
  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
};