import { useState, useEffect } from 'react';
import { Currency } from '../types';

interface Settings {
  defaultCurrency: Currency;
  showNepaliDates: boolean;
  darkMode: boolean;
}

const STORAGE_KEY = 'myfinance_settings';

const defaultSettings: Settings = {
  defaultCurrency: 'NPR',
  showNepaliDates: true,
  darkMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  return {
    settings,
    updateSettings,
  };
}