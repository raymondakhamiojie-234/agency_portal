import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Users, Landmark, AlertCircle, Save } from 'lucide-react';

export default function CreatorProfile() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile', { withCredentials: true });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
      setErrorMsg('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      await axios.put('/api/profile', profile, { withCredentials: true });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setErrorMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Profile</h1>
        <p className="text-gray-400 mt-1">Manage your personal information, brand details, and payouts.</p>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Personal Info Section */}
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" /> Personal Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={profile.full_name || ''} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={profile.email || ''} 
                disabled
                className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="tel" 
                  name="phone_number"
                  value={profile.phone_number || ''} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              <input 
                type="date" 
                name="date_of_birth"
                value={profile.date_of_birth ? profile.date_of_birth.split('T')[0] : ''} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Home Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <textarea 
                  name="home_address"
                  value={profile.home_address || ''} 
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Details Section */}
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-pink-500" /> Brand & Socials
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Brand / Page Name</label>
              <input 
                type="text" 
                name="brand_name"
                value={profile.brand_name || profile.page_name || ''} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Primary Platform</label>
              <select 
                name="primary_platform"
                value={profile.primary_platform || ''} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="" disabled className="bg-gray-900">Select Platform</option>
                <option value="YouTube" className="bg-gray-900">YouTube</option>
                <option value="Facebook" className="bg-gray-900">Facebook</option>
                <option value="TikTok" className="bg-gray-900">TikTok</option>
                <option value="Instagram" className="bg-gray-900">Instagram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Main Page URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="url" 
                  name="page_urls"
                  value={profile.page_urls?.[0] || ''} 
                  onChange={(e) => setProfile({...profile, page_urls: [e.target.value]})}
                  placeholder="https://"
                  className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Total Followers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="number" 
                  name="follower_count"
                  value={profile.follower_count || ''} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Landmark className="h-5 w-5 mr-2 text-green-400" /> Bank Details
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg flex items-center border border-yellow-500/20">
              <AlertCircle className="h-3 w-3 mr-1" /> Admin Approval Required
            </span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              For security reasons, updating your payout bank details requires administrative approval. Please contact support or your account manager to update these fields.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={profile.bank_name || ''} 
                  disabled
                  placeholder="Not set"
                  className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account Name</label>
                <input 
                  type="text" 
                  value={profile.account_name || ''} 
                  disabled
                  placeholder="Not set"
                  className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account Number</label>
                <input 
                  type="text" 
                  value={profile.bank_account_number || ''} 
                  disabled
                  placeholder="Not set"
                  className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Profile...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
