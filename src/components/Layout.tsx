import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, PiggyBank, History, Settings, Home, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DatabaseSetup from './common/DatabaseSetup';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const NavLinks = () => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded hover:bg-indigo-50 text-gray-700 ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Wallet className="w-5 h-5" />
        <span>Transactions</span>
      </NavLink>
      <NavLink
        to="/rental"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded hover:bg-indigo-50 text-gray-700 ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Home className="w-5 h-5" />
        <span>Kotha Vada</span>
      </NavLink>
      <NavLink
        to="/savings"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded hover:bg-indigo-50 text-gray-700 ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <PiggyBank className="w-5 h-5" />
        <span>Savings Goals</span>
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded hover:bg-indigo-50 text-gray-700 ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <History className="w-5 h-5" />
        <span>History</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded hover:bg-indigo-50 text-gray-700 ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
             onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Header */}
      <nav className="bg-indigo-600 text-white p-4 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-6 h-6" />
            <span className="text-xl font-bold">Mero HisabKitab</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1 rounded-md bg-indigo-700 hover:bg-indigo-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mobile Sidebar */}
          <aside
            className={`lg:hidden fixed inset-y-0 left-0 transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-50 overflow-y-auto pt-20`}
          >
            <nav className="space-y-2 p-4">
              <NavLinks />
              
              {/* Mobile User Info & Logout */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 p-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 w-full text-left rounded hover:bg-red-50 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-8rem)] sticky top-20">
            <nav className="space-y-2">
              <NavLinks />
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg shadow-md p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Database Setup Component */}
      <DatabaseSetup />
    </div>
  );
}