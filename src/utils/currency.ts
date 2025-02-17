const EXCHANGE_RATE = 132.50; // NPR to USD rate (fixed for local usage)

export const formatCurrency = (amount: number, currency: 'NPR' | 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const convertCurrency = (
  amount: number,
  from: 'NPR' | 'USD',
  to: 'NPR' | 'USD'
): number => {
  if (from === to) return amount;
  return from === 'NPR' ? amount / EXCHANGE_RATE : amount * EXCHANGE_RATE;
};