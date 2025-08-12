import { Shield, Users, Database, CheckCircle } from 'lucide-react';

export default function AuthInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Authentication System</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <Users className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900">Local Storage</h4>
            <p className="text-sm text-gray-600">User data stored in browser</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Database className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900">Secure Login</h4>
            <p className="text-sm text-gray-600">Email & password validation</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900">Session Management</h4>
            <p className="text-sm text-gray-600">Auto login on return visits</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md p-4 border border-indigo-200">
        <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Sign up with your email and a secure password</li>
          <li>• Your credentials are stored securely in your browser</li>
          <li>• Login automatically when you return</li>
          <li>• All your financial data remains private to your browser</li>
        </ul>
      </div>
    </div>
  );
}
