import { supabase } from '../lib/supabase';

// Test database connection and verify tables exist
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('transactions')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('Database connection failed:', healthError);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Check if required tables exist
    const tables = ['transactions', 'savings_goals', 'room_rentals', 'rental_payments', 'user_settings'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table '${table}' not found or accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
};

// Test authentication by attempting to get current user
export const testAuthentication = async () => {
  try {
    console.log('Testing authentication...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth test error:', error);
      return false;
    }
    
    console.log('✅ Authentication working, current user:', user ? user.email : 'None');
    return true;
  } catch (error) {
    console.error('Authentication test failed:', error);
    return false;
  }
};
