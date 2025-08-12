import { supabase } from '../lib/supabase';
import { Transaction, SavingsGoal, RoomRental, RentalPayment, UserSettings } from '../types';

// ================================================
// TRANSACTION OPERATIONS
// ================================================

export const transactionService = {
  // Get all transactions for current user
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data.map(transaction => ({
      ...transaction,
      // Map database fields to frontend fields for backward compatibility
      subCategory: transaction.sub_category,
      isPersonal: transaction.is_personal,
    }));
  },

  // Create new transaction
  async create(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: transaction.amount,
        currency: transaction.currency,
        type: transaction.type,
        category: transaction.category,
        sub_category: transaction.sub_category,
        description: transaction.description,
        date: transaction.date,
        is_personal: transaction.is_personal ?? true,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    return {
      ...data,
      subCategory: data.sub_category,
      isPersonal: data.is_personal,
    };
  },

  // Update transaction
  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const updateData: any = {};
    
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.sub_category !== undefined) updateData.sub_category = updates.sub_category;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.is_personal !== undefined) updateData.is_personal = updates.is_personal;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }

    return {
      ...data,
      subCategory: data.sub_category,
      isPersonal: data.is_personal,
    };
  },

  // Delete transaction
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Get transactions by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }

    return data.map(transaction => ({
      ...transaction,
      subCategory: transaction.sub_category,
      isPersonal: transaction.is_personal,
    }));
  }
};

// ================================================
// SAVINGS GOALS OPERATIONS
// ================================================

export const savingsGoalsService = {
  // Get all savings goals for current user
  async getAll(): Promise<SavingsGoal[]> {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching savings goals:', error);
      throw error;
    }

    return data.map(goal => ({
      ...goal,
      // Map database fields to frontend fields for backward compatibility
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
    }));
  },

  // Create new savings goal
  async create(goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SavingsGoal> {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{
        name: goal.name,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount || 0,
        currency: goal.currency,
        deadline: goal.deadline,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating savings goal:', error);
      throw error;
    }

    return {
      ...data,
      targetAmount: data.target_amount,
      currentAmount: data.current_amount,
    };
  },

  // Update savings goal
  async update(id: string, updates: Partial<SavingsGoal>): Promise<SavingsGoal> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.target_amount !== undefined) updateData.target_amount = updates.target_amount;
    if (updates.current_amount !== undefined) updateData.current_amount = updates.current_amount;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;

    const { data, error } = await supabase
      .from('savings_goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }

    return {
      ...data,
      targetAmount: data.target_amount,
      currentAmount: data.current_amount,
    };
  },

  // Delete savings goal
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting savings goal:', error);
      throw error;
    }
  }
};

// ================================================
// ROOM RENTALS OPERATIONS
// ================================================

export const roomRentalsService = {
  // Get all room rentals for current user
  async getAll(): Promise<RoomRental[]> {
    const { data, error } = await supabase
      .from('room_rentals')
      .select('*')
      .order('room_number', { ascending: true });

    if (error) {
      console.error('Error fetching room rentals:', error);
      throw error;
    }

    return data.map(rental => ({
      ...rental,
      room_number: rental.room_number,
      tenant_name: rental.tenant_name,
      rent_amount: rental.rent_amount,
      start_date: rental.start_date,
    }));
  },

  // Create new room rental
  async create(rental: Omit<RoomRental, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<RoomRental> {
    const { data, error } = await supabase
      .from('room_rentals')
      .insert([rental])
      .select()
      .single();

    if (error) {
      console.error('Error creating room rental:', error);
      throw error;
    }

    return data;
  },

  // Update room rental
  async update(id: string, updates: Partial<RoomRental>): Promise<RoomRental> {
    const { data, error } = await supabase
      .from('room_rentals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating room rental:', error);
      throw error;
    }

    return data;
  },

  // Delete room rental
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('room_rentals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting room rental:', error);
      throw error;
    }
  }
};

// ================================================
// RENTAL PAYMENTS OPERATIONS
// ================================================

export const rentalPaymentsService = {
  // Get all rental payments for current user
  async getAll(): Promise<RentalPayment[]> {
    const { data, error } = await supabase
      .from('rental_payments')
      .select(`
        *,
        room_rentals (room_number, tenant_name)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching rental payments:', error);
      throw error;
    }

    return data;
  },

  // Get payments for specific rental
  async getByRentalId(rentalId: string): Promise<RentalPayment[]> {
    const { data, error } = await supabase
      .from('rental_payments')
      .select('*')
      .eq('rental_id', rentalId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching rental payments:', error);
      throw error;
    }

    return data;
  },

  // Create new rental payment
  async create(payment: Omit<RentalPayment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<RentalPayment> {
    const { data, error } = await supabase
      .from('rental_payments')
      .insert([payment])
      .select()
      .single();

    if (error) {
      console.error('Error creating rental payment:', error);
      throw error;
    }

    return data;
  },

  // Update rental payment
  async update(id: string, updates: Partial<RentalPayment>): Promise<RentalPayment> {
    const { data, error } = await supabase
      .from('rental_payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating rental payment:', error);
      throw error;
    }

    return data;
  },

  // Delete rental payment
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rental_payments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rental payment:', error);
      throw error;
    }
  }
};

// ================================================
// USER SETTINGS OPERATIONS
// ================================================

export const userSettingsService = {
  // Get user settings (create default if doesn't exist)
  async get(): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    if (error && error.code === 'PGRST116') {
      // No settings found, create default
      return this.createDefault();
    }

    if (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }

    return data;
  },

  // Create default settings
  async createDefault(): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .insert([{
        default_currency: 'NPR',
        electricity_rate: 10.00,
        water_rate: 25.00,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating default settings:', error);
      throw error;
    }

    return data;
  },

  // Update user settings
  async update(updates: Partial<UserSettings>): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .select()
      .single();

    if (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }

    return data;
  }
};
