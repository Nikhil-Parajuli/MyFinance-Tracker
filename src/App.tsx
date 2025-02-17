import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TransactionsPage from './pages/TransactionsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import RentalPage from './pages/RentalPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TransactionsPage />} />
          <Route path="/rental" element={<RentalPage />} />
          <Route path="/savings" element={<SavingsGoalsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;