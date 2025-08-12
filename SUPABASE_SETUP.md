# Supabase Setup Guide

This guide will help you configure Supabase for your finance tracker application.

## 🚀 Quick Setup

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### 2. Create New Project
1. Click "New Project" in your dashboard
2. Fill in the details:
   - **Organization**: Select or create one
   - **Project name**: `finance-tracker-db`
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your location
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### 3. Get Your API Keys
1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)

### 4. Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Test the Setup
1. Save the `.env` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try creating a new account
4. Check your Supabase dashboard under **Authentication** > **Users**

## 🔧 Authentication Configuration

By default, Supabase requires email confirmation. To disable this for development:

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Turn OFF "Enable email confirmations" (optional for development)
3. Save the settings

## 📊 View Users

To see registered users:
1. Go to **Authentication** > **Users** in your Supabase dashboard
2. You'll see all registered users and their details

## 🔄 Migration from localStorage

Your app now uses Supabase instead of localStorage:
- ✅ Real database storage
- ✅ User sessions across devices
- ✅ Email verification (optional)
- ✅ Password reset functionality
- ✅ Production-ready security

## 🆘 Troubleshooting

### "Missing Supabase environment variables" error
- Check your `.env` file exists and has the correct values
- Restart your development server after changing `.env`

### "Invalid API key" error
- Double-check your anon key from Supabase dashboard
- Make sure there are no extra spaces in your `.env` file

### Users can't sign up
- Check if email confirmation is enabled in Supabase settings
- Check browser console for specific error messages

## 🚀 Production Deployment

When deploying to production:
1. Set environment variables in your hosting platform
2. Enable email confirmations in Supabase
3. Configure custom email templates (optional)
4. Set up proper CORS settings in Supabase

## 📱 Next Steps

After setup, you can:
- Customize email templates in Supabase
- Add social login (Google, GitHub, etc.)
- Set up Row Level Security (RLS) for data
- Add password reset functionality
- Implement user profiles and preferences
