import { AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function EnvironmentCheck() {
  const isConfigured = isSupabaseConfigured();

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-green-800">Supabase Connected</h3>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Your application is connected to Supabase database. All authentication data will be stored securely.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h3 className="font-medium text-yellow-800">Setup Required</h3>
      </div>
      <div className="text-sm text-yellow-700 space-y-2">
        <p>To use database authentication, please configure Supabase:</p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>Create a Supabase account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
          <li>Create a new project</li>
          <li>Copy your Project URL and API Key</li>
          <li>Update the <code className="bg-yellow-100 px-1 rounded">.env</code> file with your credentials</li>
          <li>Restart the development server</li>
        </ol>
        <div className="flex items-center space-x-2 mt-3 p-2 bg-yellow-100 rounded">
          <Settings className="w-4 h-4 text-yellow-600" />
          <span className="text-xs">See SUPABASE_SETUP.md for detailed instructions</span>
        </div>
      </div>
    </div>
  );
}
