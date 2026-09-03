import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import AdminEarnings from './pages/admin/AdminEarnings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminLoans from './pages/admin/AdminLoans';
import AdminMonetization from './pages/admin/AdminMonetization';
import AdminSupport from './pages/admin/AdminSupport';
import AdminCreators from './pages/admin/AdminCreators';
import AdminLogin from './pages/admin/AdminLogin';
import AdminInvoices from './pages/admin/AdminInvoices';
import CreatorFinances from './pages/CreatorFinances';
import CreatorProfile from './pages/CreatorProfile';
import CreatorSupport from './pages/CreatorSupport';
import CreatorLoan from './pages/CreatorLoan';
import CreatorContracts from './pages/CreatorContracts';
import CreatorInvoices from './pages/CreatorInvoices';
import CreatorMonetization from './pages/CreatorMonetization';
import Notifications from './pages/Notifications';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<Layout />}>
          {/* Shared / Creator Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/support" element={<CreatorSupport />} />
          <Route path="/profile" element={<CreatorProfile />} />
          <Route path="/finances" element={<CreatorFinances />} />
          <Route path="/loan" element={<CreatorLoan />} />
          <Route path="/contracts" element={<CreatorContracts />} />
          <Route path="/invoices" element={<CreatorInvoices />} />
          <Route path="/monetization" element={<CreatorMonetization />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Redirect old earnings path to new finances page */}
          <Route path="/earnings" element={<Navigate to="/finances" replace />} />
          <Route path="/settings" element={<Settings />} />
            
          {/* Admin Routes */}
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/creators" element={<AdminCreators />} />
          <Route path="/admin/earnings" element={<AdminEarnings />} />
          <Route path="/admin/monetization" element={<AdminMonetization />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/loans" element={<AdminLoans />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
