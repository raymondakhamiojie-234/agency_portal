import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Bell, Info, AlertTriangle, MessageSquare, Plus } from 'lucide-react';

export default function Notifications() {
  const { role } = useOutletContext<{ role: string }>();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Broadcast State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO');
  const [targetUser, setTargetUser] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications', { withCredentials: true });
      setNotifications(res.data);
      // Mark as read immediately if they aren't admin viewing
      if (role === 'CREATOR' && res.data.some((n: any) => !n.is_read)) {
        await axios.post('/api/notifications/read', {}, { withCredentials: true });
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/notifications', {
        user_id: targetUser,
        title,
        message,
        type
      }, { withCredentials: true });
      
      // Reset and refresh
      setTitle('');
      setMessage('');
      setShowForm(false);
      
      if (targetUser === 'ALL' || targetUser === '1') { // Assuming 1 might be this admin's ID if testing
        fetchNotifications();
      }
      alert("Notification sent successfully!");
    } catch (err) {
      console.error("Failed to send notification", err);
      alert("Failed to send notification.");
    }
  };

  const getIcon = (t: string) => {
    switch (t) {
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'SYSTEM': return <MessageSquare className="h-5 w-5 text-blue-400" />;
      default: return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            {role === 'ADMIN' ? 'Manage announcements and alerts.' : 'Important updates and announcements.'}
          </p>
        </div>
        {role === 'ADMIN' && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'New Broadcast'}
          </button>
        )}
      </div>

      {role === 'ADMIN' && showForm && (
        <div className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Send Notification</h2>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Target User</label>
                <select 
                  value={targetUser} 
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="ALL">All Creators (Broadcast)</option>
                  <option value="1">Admin Test (ID: 1)</option>
                  {/* Real implementation would fetch users list here */}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="INFO">Info</option>
                  <option value="WARNING">Warning</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Message</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm text-white resize-none"
                required
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Send Now
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-black/20 border border-border border-dashed rounded-xl p-12 text-center">
            <Bell className="h-8 w-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No notifications yet.</p>
            <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`p-4 md:p-5 rounded-xl border flex gap-4 ${
              n.is_read ? 'bg-black/20 border-border/50' : 'bg-primary/5 border-primary/20'
            }`}>
              <div className="mt-1 flex-shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-semibold truncate ${n.is_read ? 'text-gray-300' : 'text-white'}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(n.created_at)}
                  </span>
                </div>
                <p className={`text-sm ${n.is_read ? 'text-gray-400' : 'text-gray-300'}`}>
                  {n.message}
                </p>
              </div>
              {!n.is_read && (
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
