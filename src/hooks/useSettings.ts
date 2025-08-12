import { useState, useEffect } from 'react';
import { Currency, UserSettings } from '../types';
import { userSettingsService } from '../services/database';

interface AppSettings {
  defaultCurrency: Currency;
  showNepaliDates: boolean;
  darkMode: boolean;
  electricityRate: number;
  waterRate: number;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    defaultCurrency: 'NPR',
    showNepaliDates: true,
    darkMode: false,
    electricityRate: 10.00,
    waterRate: 25.00,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from database
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const userSettings = await userSettingsService.get();
      
      // Merge database settings with local UI settings
      setSettings(prev => ({
        ...prev,
        defaultCurrency: userSettings.default_currency,
        electricityRate: userSettings.electricity_rate,
        waterRate: userSettings.water_rate,
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to fetch settings from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Update database settings if they relate to user_settings table
      const dbSettings: Partial<UserSettings> = {};
      if (newSettings.defaultCurrency !== undefined) {
        dbSettings.default_currency = newSettings.defaultCurrency;
      }
      if (newSettings.electricityRate !== undefined) {
        dbSettings.electricity_rate = newSettings.electricityRate;
      }
      if (newSettings.waterRate !== undefined) {
        dbSettings.water_rate = newSettings.waterRate;
      }

      // Update database if there are relevant changes
      if (Object.keys(dbSettings).length > 0) {
        await userSettingsService.update(dbSettings);
      }

      // Update local state for all settings
      setSettings(updatedSettings);
      
      // Store UI-only settings in localStorage
      const uiOnlySettings = {
        showNepaliDates: updatedSettings.showNepaliDates,
        darkMode: updatedSettings.darkMode,
      };
      localStorage.setItem('myfinance_ui_settings', JSON.stringify(uiOnlySettings));
      
      setError(null);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings in database');
      throw err;
    }
  };

  // Load UI-only settings from localStorage
  useEffect(() => {
    const uiSettings = localStorage.getItem('myfinance_ui_settings');
    if (uiSettings) {
      const parsed = JSON.parse(uiSettings);
      setSettings(prev => ({
        ...prev,
        showNepaliDates: parsed.showNepaliDates ?? prev.showNepaliDates,
        darkMode: parsed.darkMode ?? prev.darkMode,
      }));
    }
  }, []);

  return {
    settings,
    updateSettings,
    isLoading,
    error,
    refreshSettings: fetchSettings,
  };
}