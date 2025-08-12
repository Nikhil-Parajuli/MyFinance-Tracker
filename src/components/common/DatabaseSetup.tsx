import { useState, useEffect } from 'react';
import { runDatabaseDiagnostics } from '../../utils/setupDatabase';
import { AlertCircle, CheckCircle, Database, ExternalLink } from 'lucide-react';

export default function DatabaseSetup() {
  const [isVisible, setIsVisible] = useState(false);
  const [diagnostics, setDiagnostics] = useState({
    loading: true,
    success: false,
    error: null as string | null
  });

  useEffect(() => {
    const runCheck = async () => {
      try {
        const result = await runDatabaseDiagnostics();
        setDiagnostics({
          loading: false,
          success: result,
          error: result ? null : 'Database setup incomplete'
        });
      } catch (err) {
        setDiagnostics({
          loading: false,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    };

    if (isVisible) {
      runCheck();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm z-50 flex items-center space-x-2 shadow-lg"
      >
        <Database className="w-4 h-4" />
        <span>Fix Database</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-4 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Database Setup & Diagnostics</span>
        </h2>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="p-6">
        {diagnostics.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Running diagnostics...</p>
          </div>
        ) : diagnostics.success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Database is Working! 🎉</h3>
            <p className="text-gray-600">All tables exist and transactions are working properly.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-700">Database Setup Required</h3>
              </div>
              <p className="text-red-600 text-sm">
                Your database tables are missing or not properly configured.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-700 mb-3">Step-by-Step Fix:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>
                  <strong>Open Supabase Dashboard:</strong>
                  <a 
                    href="https://app.supabase.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Go to Supabase <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li><strong>Select your project</strong> (iquhjdjejkqxpnhieaxc)</li>
                <li><strong>Click "SQL Editor"</strong> in the left sidebar</li>
                <li><strong>Click "New Query"</strong></li>
                <li><strong>Copy and paste</strong> the schema.sql content (see below)</li>
                <li><strong>Click "Run"</strong> to execute the SQL</li>
                <li><strong>Refresh this page</strong> and test again</li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">SQL Schema to Run:</h4>
              <div className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">
                <pre>{`-- Copy this entire SQL and paste it in Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 1. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(50) NOT NULL,
  sub_category VARCHAR(50),
  description TEXT,
  date DATE NOT NULL,
  is_personal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SAVINGS GOALS TABLE  
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROOM RENTALS TABLE
CREATE TABLE IF NOT EXISTS room_rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  tenant_name VARCHAR(100) NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  start_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'occupied' CHECK (status IN ('occupied', 'vacant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RENTAL PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS rental_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_rental_id UUID REFERENCES room_rentals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  payment_date DATE NOT NULL,
  payment_month VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  default_currency VARCHAR(3) DEFAULT 'NPR' CHECK (default_currency IN ('NPR', 'USD')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can only see their own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own savings goals" ON savings_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own room rentals" ON room_rentals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own rental payments" ON rental_payments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);`}</pre>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-700 mb-2">After Running SQL:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Come back to this app</li>
                <li>Click "Fix Database" button again</li>
                <li>It should show "Database is Working! 🎉"</li>
                <li>Try adding a transaction</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
