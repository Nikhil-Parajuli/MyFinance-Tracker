-- ================================================
-- FINANCE TRACKER DATABASE SCHEMA (BULLETPROOF VERSION)
-- ================================================
-- Copy and paste this ENTIRE SQL into Supabase SQL Editor
-- This version handles table creation order and dependencies properly

-- Step 1: Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS rental_payments CASCADE;
DROP TABLE IF EXISTS room_rentals CASCADE;
DROP TABLE IF EXISTS savings_goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- Step 2: Create tables in the correct order (no foreign key dependencies first)

-- 2.1 TRANSACTIONS TABLE (no dependencies)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

-- 2.2 SAVINGS GOALS TABLE (no dependencies)
CREATE TABLE savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 ROOM RENTALS TABLE (no dependencies)
CREATE TABLE room_rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  tenant_name VARCHAR(100) NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  start_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'occupied' CHECK (status IN ('occupied', 'vacant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 USER SETTINGS TABLE (no dependencies)
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  default_currency VARCHAR(3) DEFAULT 'NPR' CHECK (default_currency IN ('NPR', 'USD')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 RENTAL PAYMENTS TABLE (depends on room_rentals)
CREATE TABLE rental_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_rental_id UUID REFERENCES room_rentals(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR' CHECK (currency IN ('NPR', 'USD')),
  payment_date DATE NOT NULL,
  payment_month VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Enable Row Level Security on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies (Drop existing ones first)
-- Transactions policies
DROP POLICY IF EXISTS "Users can only see their own transactions" ON transactions;
CREATE POLICY "Users can only see their own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Savings goals policies  
DROP POLICY IF EXISTS "Users can only see their own savings goals" ON savings_goals;
CREATE POLICY "Users can only see their own savings goals" ON savings_goals
  FOR ALL USING (auth.uid() = user_id);

-- Room rentals policies
DROP POLICY IF EXISTS "Users can only see their own room rentals" ON room_rentals;
CREATE POLICY "Users can only see their own room rentals" ON room_rentals
  FOR ALL USING (auth.uid() = user_id);

-- Rental payments policies
DROP POLICY IF EXISTS "Users can only see their own rental payments" ON rental_payments;
CREATE POLICY "Users can only see their own rental payments" ON rental_payments
  FOR ALL USING (auth.uid() = user_id);

-- User settings policies
DROP POLICY IF EXISTS "Users can only see their own settings" ON user_settings;
CREATE POLICY "Users can only see their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Step 5: Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_room_rentals_user_id ON room_rentals(user_id);
CREATE INDEX idx_rental_payments_user_id ON rental_payments(user_id);
CREATE INDEX idx_rental_payments_room_rental_id ON rental_payments(room_rental_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Step 6: Create trigger function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Create triggers for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at
    BEFORE UPDATE ON savings_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_rentals_updated_at
    BEFORE UPDATE ON room_rentals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 
  'Database schema created successfully!' as status,
  'All tables created: transactions, savings_goals, room_rentals, rental_payments, user_settings' as tables,
  'RLS policies applied for data security' as security,
  'Indexes and triggers configured' as performance;
