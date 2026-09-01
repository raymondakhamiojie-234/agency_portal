import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MessageCircle, LifeBuoy, CheckCircle, Clock, Plus, ArrowRight,
  Calendar, Video, Send, Bell, CheckSquare, Sparkles
} from 'lucide-react';

export default function CreatorSupport() {
  const [activeTab, setActiveTab] = useState<'issues' | 'updates' | 'chat' | 'meetings'>('issues');
  const [overview, setOverview] = useState<any>(null);
  
  // Data States
  const [tickets, setTickets] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newChatMsg, setNewChatMsg] = useState('');
  const [newTicketMsg, setNewTicketMsg] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const ticketBottomRef = useRef<HTMLDivElement>(null);

  // Form States
  const [issueForm, setIssueForm] = useState({ subject: '', category: 'Instagram', platform: 'Instagram', priority: 'Normal', message: '' });
  const [meetingForm, setMeetingForm] = useState({ purpose: 'Monthly Review', customPurpose: '', meeting_date: '', meeting_time: '', notes: '' });

  const meetingPurposes = [
    "Monthly Review",
    "Content Strategy Session",
    "Emergency Growth Help",
    "Sponsorship Negotiation",
    "Monetization Strategy",
    "Other"
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'issues' && !activeTicket) fetchTickets();
    if (activeTab === 'updates') { fetchUpdates(); fetchTasks(); }
    if (activeTab === 'chat') fetchChatMessages();
    if (activeTab === 'meetings') fetchMeetings();
  }, [activeTab]);

  useEffect(() => {
    if (activeTicket) {
      fetchTicketMessages(activeTicket.id);
    }
  }, [activeTicket]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    ticketBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticketMessages]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/manager/dashboard', { withCredentials: true });
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    const res = await axios.get('/api/manager/tickets', { withCredentials: true });
    setTickets(res.data);
  };

  const fetchUpdates = async () => {
    const res = await axios.get('/api/manager/updates', { withCredentials: true });
    setUpdates(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get('/api/manager/tasks', { withCredentials: true });
    setTasks(res.data);
  };

  const fetchChatMessages = async () => {
    const res = await axios.get('/api/manager/chat', { withCredentials: true });
    setChatMessages(res.data);
  };

  const fetchMeetings = async () => {
    const res = await axios.get('/api/manager/meetings', { withCredentials: true });
    setMeetings(res.data);
  };

  const fetchTicketMessages = async (ticketId: number) => {
    const res = await axios.get(`/api/manager/tickets/${ticketId}/messages`, { withCredentials: true });
    setTicketMessages(res.data);
  };

  const [isSendingTicket, setIsSendingTicket] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/manager/tickets', issueForm, { withCredentials: true });
      setTickets([res.data, ...tickets]);
      setShowNewIssue(false);
      setIssueForm({ subject: '', category: 'Instagram', platform: 'Instagram', priority: 'Normal', message: '' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTicketMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketMsg.trim() || !activeTicket || isSendingTicket) return;
    setIsSendingTicket(true);
    try {
      const res = await axios.post(`/api/manager/tickets/${activeTicket.id}/messages`, { message: newTicketMsg }, { withCredentials: true });
      const newMessages = Array.isArray(res.data) ? res.data : [res.data];
      setTicketMessages([...ticketMessages, ...newMessages]);
      setNewTicketMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingTicket(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMsg.trim() || isSendingChat) return;
    setIsSendingChat(true);
    try {
      const res = await axios.post('/api/manager/chat', { message: newChatMsg }, { withCredentials: true });
      const newMessages = Array.isArray(res.data) ? res.data : [res.data];
      setChatMessages([...chatMessages, ...newMessages]);
      setNewChatMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleRequestMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/manager/meetings/request', meetingForm, { withCredentials: true });
      setMeetings([res.data, ...meetings]);
      setShowNewMeeting(false);
      setMeetingForm({ purpose: 'Monthly Review', customPurpose: '', meeting_date: '', meeting_time: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await axios.put(`/api/manager/tasks/${taskId}/complete`, {}, { withCredentials: true });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkUpdateRead = async (updateId: number) => {
    try {
      await axios.put(`/api/manager/updates/${updateId}/read`, {}, { withCredentials: true });
      setUpdates(updates.map(u => u.id === updateId ? { ...u, is_read: true } : u));
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><div className="text-gray-400">Loading Support Center...</div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 backdrop-blur-md border border-border p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Creator Support & Talent Manager</h1>
          <p className="text-gray-400 mt-1 max-w-2xl">Get support, receive guidance, stay updated, and communicate directly with your Falcus Media team.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <p className="text-sm text-gray-400">Your Talent Manager</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {overview?.managerName ? overview.managerName.charAt(0) : 'F'}
            </div>
            <div>
              <p className="text-white font-semibold">{overview?.managerName || 'Falcus Media Team'}</p>
              <div className="flex items-center text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('issues')}>
          <div className="flex justify-between items-start">
            <div className="bg-red-500/10 p-2.5 rounded-lg text-red-400">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white">{overview?.openIssues || 0}</span>
          </div>
          <h3 className="text-gray-400 font-medium mt-3">Open Issues</h3>
        </div>
        
        <div className="bg-black/30 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('updates')}>
          <div className="flex justify-between items-start">
            <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
              <Bell className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white">{overview?.unreadUpdates || 0}</span>
          </div>
          <h3 className="text-gray-400 font-medium mt-3">New Updates</h3>
        </div>

        <div className="bg-black/30 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('updates')}>
          <div className="flex justify-between items-start">
            <div className="bg-orange-500/10 p-2.5 rounded-lg text-orange-400">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white">{overview?.pendingTasks || 0}</span>
          </div>
          <h3 className="text-gray-400 font-medium mt-3">Pending Tasks</h3>
        </div>

        <div className="bg-black/30 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('meetings')}>
          <div className="flex justify-between items-start">
            <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
              <Video className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-gray-400 font-medium mt-3 mb-1">Next Meeting</h3>
          {overview?.nextMeeting ? (
            <div>
              <p className="text-white text-sm font-semibold truncate">{overview.nextMeeting.title}</p>
              <p className="text-xs text-gray-500">{new Date(overview.nextMeeting.meeting_date).toLocaleDateString()} at {overview.nextMeeting.meeting_time}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming meetings</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border overflow-x-auto">
        <button 
          onClick={() => {setActiveTab('issues'); setActiveTicket(null);}} 
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'issues' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          My Issues
        </button>
        <button 
          onClick={() => setActiveTab('updates')} 
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'updates' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Updates & Tasks
        </button>
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Direct Chat
        </button>
        <button 
          onClick={() => setActiveTab('meetings')} 
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'meetings' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Meetings
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-black/30 backdrop-blur-md border border-border rounded-2xl min-h-[500px]">
        
        {/* --- TAB: ISSUES --- */}
        {activeTab === 'issues' && (
          <div className="flex h-[600px]">
            {/* Sidebar List */}
            <div className={`w-full md:w-1/3 border-r border-border flex flex-col ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="font-semibold text-white">Support Tickets</h2>
                <button onClick={() => setShowNewIssue(true)} className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {tickets.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No issues reported.</p>
                ) : (
                  tickets.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => { setActiveTicket(t); setShowNewIssue(false); }}
                      className={`p-4 rounded-xl cursor-pointer transition-colors border ${activeTicket?.id === t.id ? 'bg-white/10 border-primary/30' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-400">#FM-{t.id.toString().padStart(4, '0')}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${t.status === 'Open' ? 'bg-red-500/20 text-red-400' : t.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-sm truncate mb-1">{t.subject}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{t.platform}</span>
                        <span className="text-xs text-gray-600">{new Date(t.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Main Area */}
            <div className={`flex-1 flex flex-col ${!activeTicket && !showNewIssue ? 'hidden md:flex' : 'flex'}`}>
              {showNewIssue ? (
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <button onClick={() => setShowNewIssue(false)} className="md:hidden mr-3 text-gray-400"><ArrowRight className="h-5 w-5 rotate-180" /></button>
                    <h2 className="text-2xl font-bold text-white">Report an Issue</h2>
                  </div>
                  <form onSubmit={handleCreateIssue} className="space-y-5 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Issue Title</label>
                      <input required type="text" value={issueForm.subject} onChange={e => setIssueForm({...issueForm, subject: e.target.value})} className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white" placeholder="Brief description of the problem" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
                        <select value={issueForm.platform} onChange={e => setIssueForm({...issueForm, platform: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-white">
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Facebook">Facebook</option>
                          <option value="X/Twitter">X/Twitter</option>
                          <option value="Portal/Platform">Agency Portal</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                        <select value={issueForm.priority} onChange={e => setIssueForm({...issueForm, priority: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-white">
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                      <select value={issueForm.category} onChange={e => setIssueForm({...issueForm, category: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-white">
                        <option value="Account restriction">Account restriction</option>
                        <option value="Monetization problem">Monetization problem</option>
                        <option value="Login/access issue">Login/access issue</option>
                        <option value="Low reach">Low reach / Algorithm</option>
                        <option value="Payment issue">Payment issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                      <textarea required rows={5} value={issueForm.message} onChange={e => setIssueForm({...issueForm, message: e.target.value})} className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-white" placeholder="Describe your problem in detail..."></textarea>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover">Submit Issue</button>
                  </form>
                </div>
              ) : activeTicket ? (
                <div className="flex-1 flex flex-col h-full">
                  {/* Ticket Header */}
                  <div className="p-4 border-b border-border bg-white/[0.02] flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center">
                      <button onClick={() => setActiveTicket(null)} className="md:hidden mr-3 text-gray-400"><ArrowRight className="h-5 w-5 rotate-180" /></button>
                      <div>
                        <h3 className="text-white font-semibold">{activeTicket.subject}</h3>
                        <p className="text-xs text-gray-500">Ticket #FM-{activeTicket.id.toString().padStart(4, '0')} • {activeTicket.platform}</p>
                      </div>
                    </div>
                    <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${activeTicket.status === 'Open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : activeTicket.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                      {activeTicket.status}
                    </span>
                  </div>
                  
                  {/* Ticket Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Initial Issue Message */}
                    <div className="flex flex-col items-start max-w-[85%]">
                      <span className="text-xs text-gray-500 mb-1 ml-1">You • {new Date(activeTicket.created_at).toLocaleString()}</span>
                      <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                        <div className="font-semibold mb-2 pb-2 border-b border-white/10 flex gap-4">
                          <span>Priority: {activeTicket.priority}</span>
                          <span>Category: {activeTicket.category}</span>
                        </div>
                        {activeTicket.message}
                      </div>
                    </div>

                    {/* Replies */}
                    {ticketMessages.map((msg, i) => {
                      const isCreator = msg.sender_role === 'CREATOR';
                      const isAI = msg.sender_role === 'AI_ASSISTANT';
                      return (
                        <div key={i} className={`flex flex-col max-w-[85%] ${isCreator ? 'self-end items-end' : 'self-start items-start'}`}>
                          <span className={`text-xs text-gray-500 mb-1 ${isCreator ? 'mr-1' : 'ml-1'} flex items-center gap-1`}>
                            {isAI && <Sparkles className="h-3 w-3 text-primary" />}
                            {isCreator ? 'You' : isAI ? 'AI Support Bot' : msg.sender_role} • {new Date(msg.created_at).toLocaleString()}
                          </span>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${isCreator ? 'bg-primary text-white rounded-tr-sm' : isAI ? 'bg-primary/20 text-white border border-primary/30 rounded-tl-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={ticketBottomRef} />
                  </div>

                  {/* Input */}
                  {activeTicket.status !== 'Closed' && activeTicket.status !== 'Resolved' && (
                    <form onSubmit={handleSendTicketMessage} className="p-4 border-t border-border flex items-center space-x-3 bg-black/40">
                      <input
                        type="text"
                        value={newTicketMsg}
                        onChange={(e) => setNewTicketMsg(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isSendingTicket}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                      />
                      <button 
                        type="submit" 
                        disabled={!newTicketMsg.trim() || isSendingTicket}
                        className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSendingTicket ? <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span> : <Send className="h-5 w-5" />}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Support Center</h3>
                  <p className="text-gray-400 max-w-md mb-6">Select a ticket from the left to view the conversation, or report a new issue to get help from our team.</p>
                  <button onClick={() => setShowNewIssue(true)} className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center">
                    <Plus className="h-5 w-5 mr-2" /> Report an Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: UPDATES & TASKS --- */}
        {activeTab === 'updates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Updates Column */}
            <div>
              <div className="flex items-center mb-4">
                <Bell className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Manager Updates</h2>
              </div>
              <div className="space-y-4">
                {updates.length === 0 ? (
                  <p className="text-gray-500 text-sm">No new updates.</p>
                ) : (
                  updates.map(u => (
                    <div key={u.id} className={`p-5 rounded-2xl border ${!u.is_read ? 'bg-blue-500/5 border-blue-500/30' : 'bg-white/5 border-border'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{u.title}</h4>
                        {!u.is_read && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{u.message}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()} • By {u.manager_name || 'Manager'}</span>
                        {!u.is_read && (
                          <button onClick={() => handleMarkUpdateRead(u.id)} className="text-xs text-primary hover:text-white transition-colors font-medium">Mark as Read</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tasks Column */}
            <div>
              <div className="flex items-center mb-4">
                <CheckSquare className="h-5 w-5 text-orange-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Tasks & Recommendations</h2>
              </div>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending tasks.</p>
                ) : (
                  tasks.map(t => (
                    <div key={t.id} className="p-5 rounded-2xl border border-border bg-white/5 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">{t.platform} • {t.area}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="text-white font-medium mb-2 relative z-10">{t.title}</h4>
                      <p className="text-sm text-gray-400 mb-4 relative z-10">{t.description}</p>
                      
                      <div className="bg-black/30 rounded-xl p-3 mb-4 border border-white/5 relative z-10">
                        <div className="mb-2">
                          <span className="text-xs text-gray-500 block mb-0.5">Expected Goal</span>
                          <span className="text-sm text-gray-300">{t.expected_goal}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">Action Required</span>
                          <span className="text-sm text-white font-medium">{t.action_required}</span>
                        </div>
                      </div>

                      {t.status !== 'Completed' && (
                        <button onClick={() => handleCompleteTask(t.id)} className="w-full py-2.5 bg-white/10 hover:bg-green-500/20 hover:text-green-400 text-white font-medium rounded-xl transition-colors relative z-10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: DIRECT CHAT --- */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[600px]">
            <div className="p-4 border-b border-border bg-white/[0.02] flex items-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                {overview?.managerName ? overview.managerName.charAt(0) : 'M'}
              </div>
              <div>
                <h3 className="text-white font-semibold">{overview?.managerName || 'Talent Manager'}</h3>
                <p className="text-xs text-green-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Direct Chat</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-center mb-6">
                <span className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">This is the beginning of your direct conversation history.</span>
              </div>
              
              {chatMessages.map((msg, i) => {
                const isCreator = msg.sender_role === 'CREATOR';
                const isAI = msg.sender_role === 'AI_ASSISTANT';
                return (
                  <div key={i} className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isCreator ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className={`text-xs text-gray-500 mb-1 ${isCreator ? 'mr-1' : 'ml-1'} flex items-center gap-1`}>
                      {isAI && <Sparkles className="h-3 w-3 text-primary" />}
                      {isCreator ? '' : isAI ? 'AI Talent Manager • ' : ''}{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${isCreator ? 'bg-primary text-white rounded-tr-sm' : isAI ? 'bg-primary/20 border border-primary/30 text-white rounded-tl-sm' : 'bg-white/10 text-white border border-border rounded-tl-sm'}`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>
            
            <form onSubmit={handleSendChat} className="p-4 border-t border-border flex items-center space-x-3 bg-black/40">
              <input
                type="text"
                value={newChatMsg}
                onChange={(e) => setNewChatMsg(e.target.value)}
                placeholder="Message your Talent Manager..."
                disabled={isSendingChat}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!newChatMsg.trim() || isSendingChat} 
                className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSendingChat ? <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB: MEETINGS --- */}
        {activeTab === 'meetings' && (
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <button 
                onClick={() => setShowNewMeeting(!showNewMeeting)} 
                className="w-full mb-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex justify-center items-center"
              >
                {showNewMeeting ? 'Cancel' : <><Plus className="h-5 w-5 mr-2" /> Request a Meeting</>}
              </button>
              
              {showNewMeeting && (
                <div className="bg-white/5 border border-border rounded-2xl p-5 mb-6">
                  <h3 className="text-white font-semibold mb-4">New Meeting Request</h3>
                  <form onSubmit={handleRequestMeeting} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Purpose</label>
                      <select value={meetingForm.purpose} onChange={e => setMeetingForm({...meetingForm, purpose: e.target.value})} className="w-full bg-black border border-border rounded-lg px-3 py-2 text-sm text-white">
                        {meetingPurposes.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    {meetingForm.purpose === 'Other' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Custom Purpose</label>
                        <input required type="text" value={meetingForm.customPurpose} onChange={e => setMeetingForm({...meetingForm, customPurpose: e.target.value})} className="w-full bg-black border border-border rounded-lg px-3 py-2 text-sm text-white" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Preferred Date</label>
                        <input required type="date" value={meetingForm.meeting_date} onChange={e => setMeetingForm({...meetingForm, meeting_date: e.target.value})} className="w-full bg-black border border-border rounded-lg px-3 py-2 text-sm text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Preferred Time</label>
                        <input required type="time" value={meetingForm.meeting_time} onChange={e => setMeetingForm({...meetingForm, meeting_time: e.target.value})} className="w-full bg-black border border-border rounded-lg px-3 py-2 text-sm text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Additional Notes (Optional)</label>
                      <textarea rows={3} value={meetingForm.notes} onChange={e => setMeetingForm({...meetingForm, notes: e.target.value})} className="w-full bg-black border border-border rounded-lg px-3 py-2 text-sm text-white"></textarea>
                    </div>
                    <button type="submit" className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg">Submit Request</button>
                  </form>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Meeting History & Schedule</h3>
              {meetings.length === 0 ? (
                <div className="text-center py-12 border border-border rounded-2xl bg-white/[0.02]">
                  <Calendar className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">You have no meetings scheduled.</p>
                </div>
              ) : (
                meetings.map(m => (
                  <div key={m.id} className="p-5 rounded-2xl border border-border bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-medium">{m.title}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 
                          m.status === 'Requested' ? 'bg-blue-500/20 text-blue-400' : 
                          m.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 gap-4 mt-2">
                        <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {new Date(m.meeting_date).toLocaleDateString()}</span>
                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> {m.meeting_time}</span>
                      </div>
                      {m.notes && <p className="text-sm text-gray-500 mt-3 border-l-2 border-white/10 pl-3 italic">{m.notes}</p>}
                    </div>
                    
                    {m.status === 'Confirmed' && m.google_meet_link && (
                      <a 
                        href={m.google_meet_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white font-medium rounded-xl transition-all flex items-center whitespace-nowrap"
                      >
                        <Video className="h-5 w-5 mr-2" /> Join Google Meet
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
