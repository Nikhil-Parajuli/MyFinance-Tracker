# 🗄️ Database Setup Guide

## Step 1: Create Database Tables

### 📖 What This Does:
- Creates 5 tables to store all your finance data
- Sets up security so users can only see their own data
- Adds indexes for fast performance
- Creates automatic timestamp updates

### 🛠️ How To Do It:

1. **Open Supabase Dashboard:**
   - Go to [your project dashboard](https://app.supabase.com)
   - Click on your `finance-tracker-db` project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema:**
   - Copy the entire content from `database/schema.sql`
   - Paste it into the SQL editor
   - Click "Run" button (or press Ctrl/Cmd + Enter)
   - You should see "Database schema created successfully! 🎉"

4. **Verify Tables Created:**
   - Go to "Table Editor" in the left sidebar
   - You should see 5 new tables:
     - `transactions`
     - `savings_goals` 
     - `room_rentals`
     - `rental_payments`
     - `user_settings`

### ✅ What You'll Have After This:
- Real database tables for all your data
- Secure access (users only see their own data)
- Ready for the next step: connecting your app

### 🆘 If Something Goes Wrong:
- Check for any red error messages in SQL editor
- Make sure you're in the right project
- Try running the schema again (it's safe to run multiple times)

---

## 📋 Checklist:
- [ ] Opened Supabase dashboard
- [ ] Ran the schema.sql file
- [ ] Saw success message
- [ ] Verified 5 tables exist in Table Editor
- [ ] Ready for next step

**Once done, let me know and we'll move to Step 2!** 🚀
