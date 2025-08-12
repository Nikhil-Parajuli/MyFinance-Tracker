-- ================================================
-- FINANCE TRACKER DATABASE SCHEMA
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- This creates all tables needed for your finance app

-- 1. TRANSACTIONS TABLE
CREATE TABLE transactions (
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
CREATE TABLE savings_goals (
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
CREATE TABLE room_rentals (
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
CREATE TABLE rental_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rental_id UUID REFERENCES room_rentals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  rent_amount DECIMAL(10,2) NOT NULL,
  electricity_units DECIMAL(6,2) DEFAULT 0,
  electricity_amount DECIMAL(8,2) DEFAULT 0,
  water_units DECIMAL(6,2) DEFAULT 0,
  water_amount DECIMAL(8,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. USER SETTINGS TABLE
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  default_currency VARCHAR(3) DEFAULT 'NPR' CHECK (default_currency IN ('NPR', 'USD')),
  electricity_rate DECIMAL(6,2) DEFAULT 10.00,
  water_rate DECIMAL(6,2) DEFAULT 25.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ================================================

-- Indexes for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_room_rentals_user_id ON room_rentals(user_id);
CREATE INDEX idx_rental_payments_user_id ON rental_payments(user_id);
CREATE INDEX idx_rental_payments_rental_id ON rental_payments(rental_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for TRANSACTIONS
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for SAVINGS GOALS
CREATE POLICY "Users can view own savings goals" ON savings_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals" ON savings_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals" ON savings_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals" ON savings_goals
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ROOM RENTALS
CREATE POLICY "Users can view own room rentals" ON room_rentals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own room rentals" ON room_rentals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own room rentals" ON room_rentals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own room rentals" ON room_rentals
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for RENTAL PAYMENTS
CREATE POLICY "Users can view own rental payments" ON rental_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rental payments" ON rental_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rental payments" ON rental_payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rental payments" ON rental_payments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for USER SETTINGS
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at timestamps
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_rentals_updated_at BEFORE UPDATE ON room_rentals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_payments_updated_at BEFORE UPDATE ON rental_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SUCCESS MESSAGE
-- ================================================

-- If you see this message, all tables were created successfully!
SELECT 'Database schema created successfully! 🎉' as message;
