import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import AdminEarnings from './pages/admin/AdminEarnings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminLoans from './pages/admin/AdminLoans';
import AdminMonetization from './pages/admin/AdminMonetization';
import CreatorFinances from './pages/CreatorFinances';
import CreatorLoan from './pages/CreatorLoan';
import CreatorContracts from './pages/CreatorContracts';
import CreatorInvoices from './pages/CreatorInvoices';
import CreatorMonetization from './pages/CreatorMonetization';
import Notifications from './pages/Notifications';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<Layout />}>
          {/* Shared / Creator Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/finances" element={<CreatorFinances />} />
          <Route path="/loan" element={<CreatorLoan />} />
          <Route path="/contracts" element={<CreatorContracts />} />
          <Route path="/invoices" element={<CreatorInvoices />} />
          <Route path="/monetization" element={<CreatorMonetization />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Stubs */}
          <Route path="/earnings" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<div className="text-white">Profile Page (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="text-white">Settings Page (Coming Soon)</div>} />
            
          {/* Admin Routes */}
          <Route path="/admin/creators" element={<div className="text-white">Admin Creators (Coming Soon)</div>} />
          <Route path="/admin/earnings" element={<AdminEarnings />} />
          <Route path="/admin/monetization" element={<AdminMonetization />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/loans" element={<AdminLoans />} />
          <Route path="/admin/invoices" element={<div className="text-white">Admin Invoices (Coming Soon)</div>} />
          <Route path="/admin/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
