import { useEffect, useState } from 'react';
import { testDatabaseConnection, testAuthentication } from '../../utils/dbTest';

export default function DatabaseDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const [tests, setTests] = useState({
    connection: false,
    auth: false,
    loading: true
  });

  useEffect(() => {
    const runTests = async () => {
      console.log('🔍 Running database diagnostics...');
      
      const connectionResult = await testDatabaseConnection();
      const authResult = await testAuthentication();
      
      setTests({
        connection: connectionResult,
        auth: authResult,
        loading: false
      });
    };

    runTests();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm z-50"
      >
        Debug DB
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Database Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      {tests.loading ? (
        <p className="text-sm text-gray-600">Running tests...</p>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${tests.connection ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Database Connection</span>
          </div>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${tests.auth ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Authentication</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Check browser console for details
          </p>
        </div>
      )}
    </div>
  );
}
