import { supabase } from '../lib/supabase';

// Check if a table exists and has the right structure
const checkTable = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`❌ Table '${tableName}' error:`, error.message);
      return false;
    }
    
    console.log(`✅ Table '${tableName}' exists and is accessible`);
    return true;
  } catch (err) {
    console.error(`❌ Table '${tableName}' check failed:`, err);
    return false;
  }
};

// Test adding a simple transaction
export const testTransaction = async () => {
  try {
    console.log('🧪 Testing transaction creation...');
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.error('❌ No authenticated user found');
      return false;
    }
    
    const testData = {
      amount: 100.00,
      currency: 'NPR',
      type: 'income',
      category: 'Test',
      sub_category: 'Database Test',
      description: 'Testing database connection',
      date: new Date().toISOString().split('T')[0],
      is_personal: true
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([testData])
      .select();
    
    if (error) {
      console.error('❌ Transaction test failed:', error);
      return false;
    }
    
    console.log('✅ Transaction test successful:', data);
    
    // Clean up test data
    if (data && data[0]) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', data[0].id);
      console.log('✅ Test data cleaned up');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Transaction test error:', err);
    return false;
  }
};

// Complete database health check
export const runDatabaseDiagnostics = async () => {
  console.log('🔍 Starting comprehensive database diagnostics...');
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('❌ Authentication failed:', authError);
    return false;
  }
  console.log('✅ User authenticated:', user.email);
  
  // Check all required tables
  const tables = ['transactions', 'savings_goals', 'room_rentals', 'rental_payments', 'user_settings'];
  const results = await Promise.all(tables.map(table => checkTable(table)));
  
  const allTablesExist = results.every(result => result === true);
  
  if (!allTablesExist) {
    console.error('❌ Some tables are missing or inaccessible');
    console.log('📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Open the SQL Editor');
    console.log('3. Run the schema.sql file from your project');
    return false;
  }
  
  // Test transaction functionality
  const transactionTest = await testTransaction();
  
  if (!transactionTest) {
    console.error('❌ Transaction functionality is not working');
    return false;
  }
  
  console.log('🎉 All database checks passed!');
  return true;
};
