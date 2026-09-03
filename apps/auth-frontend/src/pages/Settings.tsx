import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Save, CheckCircle, AlertCircle, KeyRound, Loader2, Key } from 'lucide-react';

export default function Settings() {
  const { user, role } = useOutletContext<any>();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'password_requests'>('account');
  
  // Account State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Admin Password Reset Requests State
  const [passwordRequests, setPasswordRequests] = useState<any[]>([]);
  const [resolvingRequestId, setResolvingRequestId] = useState<string | null>(null);
  const [adminGeneratedPassword, setAdminGeneratedPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'ADMIN' && activeTab === 'password_requests') {
      fetchPasswordRequests();
    }
  }, [activeTab, role]);

  const fetchPasswordRequests = async () => {
    try {
      const res = await axios.get('/api/admin/password-requests', { withCredentials: true });
      setPasswordRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    
    try {
      await axios.put('/api/auth/profile', { name, email }, { withCredentials: true });
      setSuccess('Account updated successfully. Some changes may require re-login to display.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update account.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true); setError(''); setSuccess('');
    
    try {
      await axios.put('/api/auth/password', { currentPassword, newPassword }, { withCredentials: true });
      setSuccess('Password updated successfully.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminResetPassword = async (requestId: string, userEmail: string) => {
    if (!adminGeneratedPassword) {
      alert("Please enter a new password to assign.");
      return;
    }
    
    setResolvingRequestId(requestId);
    try {
      await axios.put('/api/admin/reset-user-password', {
        requestId,
        email: userEmail,
        newPassword: adminGeneratedPassword
      }, { withCredentials: true });
      
      alert('Password reset successfully!');
      setAdminGeneratedPassword('');
      fetchPasswordRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setResolvingRequestId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and security.</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => { setActiveTab('account'); setError(''); setSuccess(''); }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'account' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="h-5 w-5 mr-3" /> Account
          </button>
          
          <button
            onClick={() => { setActiveTab('security'); setError(''); setSuccess(''); }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'security' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock className="h-5 w-5 mr-3" /> Security
          </button>

          {role === 'ADMIN' && (
            <button
              onClick={() => { setActiveTab('password_requests'); setError(''); setSuccess(''); }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'password_requests' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <KeyRound className="h-5 w-5 mr-3" /> Password Requests
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
          
          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div>
              <div className="px-6 py-5 border-b border-border bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-white">Account Details</h2>
                <p className="text-sm text-gray-400">Update your basic profile information.</p>
              </div>
              <form onSubmit={handleUpdateAccount} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div>
              <div className="px-6 py-5 border-b border-border bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-white">Security</h2>
                <p className="text-sm text-gray-400">Update your password to keep your account secure.</p>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                <div className="border-t border-border pt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PASSWORD REQUESTS TAB (ADMIN ONLY) */}
          {activeTab === 'password_requests' && role === 'ADMIN' && (
            <div>
              <div className="px-6 py-5 border-b border-border bg-white/[0.02]">
                <h2 className="text-lg font-semibold text-white">Password Reset Requests</h2>
                <p className="text-sm text-gray-400">Creators who have requested a password reset.</p>
              </div>
              <div className="p-6">
                {passwordRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-10 w-10 mx-auto mb-3 text-gray-600" />
                    No pending password reset requests.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {passwordRequests.map((req) => (
                      <div key={req.id} className={`p-5 rounded-xl border ${req.status === 'PENDING' ? 'bg-white/5 border-white/10' : 'bg-green-500/5 border-green-500/20'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h3 className="font-medium text-white">{req.name || 'Unknown User'}</h3>
                            <p className="text-sm text-gray-400">{req.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Requested on: {new Date(req.created_at).toLocaleString()}</p>
                          </div>
                          
                          {req.status === 'PENDING' ? (
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                              <input 
                                type="text"
                                placeholder="New password"
                                value={resolvingRequestId === req.id ? adminGeneratedPassword : ''}
                                onChange={e => {
                                  setResolvingRequestId(req.id);
                                  setAdminGeneratedPassword(e.target.value);
                                }}
                                className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <button 
                                onClick={() => handleAdminResetPassword(req.id, req.email)}
                                disabled={resolvingRequestId === req.id && loading}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap justify-center"
                              >
                                <Key className="h-4 w-4 mr-2" /> Reset & Approve
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-green-400 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Resolved
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
