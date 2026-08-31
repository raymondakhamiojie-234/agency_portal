import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Users, MessageCircle, Calendar, CheckSquare, Plus, Clock, 
  Send, LifeBuoy, Video, Search, ChevronRight
} from 'lucide-react';

export default function AdminSupport() {
  const [creators, setCreators] = useState<any[]>([]);
  const [activeCreator, setActiveCreator] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('tickets');
  const [search, setSearch] = useState('');

  // Data for active creator
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newTicketMsg, setNewTicketMsg] = useState('');

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMsg, setNewChatMsg] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '' });

  const [meetings, setMeetings] = useState<any[]>([]);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<any | null>(null);
  const [meetLink, setMeetLink] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const ticketBottomRef = useRef<HTMLDivElement>(null);

  // Load creators
  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await axios.get('/api/admin/support/creators', { withCredentials: true });
      setCreators(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load creator data when selected
  useEffect(() => {
    if (activeCreator) {
      // Clear previous state immediately to avoid showing old data
      setChatMessages([]);
      setTicketMessages([]);
      setActiveTicket(null);
      setMeetings([]);
      
      fetchTickets();
      fetchChat();
      fetchMeetings();
    }
  }, [activeCreator]);

  const fetchTickets = async () => {
    if (!activeCreator) return;
    try {
      const res = await axios.get(`/api/admin/support/tickets/${activeCreator.id}`, { withCredentials: true });
      setTickets(res.data);
      if (res.data.length > 0) {
        handleSelectTicket(res.data[0]);
      } else {
        setActiveTicket(null);
        setTicketMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTicket = async (ticket: any) => {
    setActiveTicket(ticket);
    try {
      const res = await axios.get(`/api/admin/support/tickets/${ticket.id}/messages`, { withCredentials: true });
      setTicketMessages(res.data);
      setTimeout(() => ticketBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTicketMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketMsg.trim() || !activeTicket) return;
    try {
      const res = await axios.post(`/api/admin/support/tickets/${activeTicket.id}/messages`, { message: newTicketMsg }, { withCredentials: true });
      setTicketMessages([...ticketMessages, res.data]);
      setNewTicketMsg('');
      setTimeout(() => ticketBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    try {
      await axios.put(`/api/admin/support/tickets/${activeTicket.id}/status`, { status: 'Resolved' }, { withCredentials: true });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChat = async () => {
    if (!activeCreator) return;
    try {
      const res = await axios.get(`/api/admin/support/chat/${activeCreator.id}`, { withCredentials: true });
      setChatMessages(res.data);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMsg.trim() || !activeCreator) return;
    try {
      const res = await axios.post(`/api/admin/support/chat/${activeCreator.id}`, { message: newChatMsg }, { withCredentials: true });
      setChatMessages([...chatMessages, res.data]);
      setNewChatMsg('');
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCreator) return;
    try {
      await axios.post('/api/admin/support/tasks', { ...taskForm, creator_id: activeCreator.id }, { withCredentials: true });
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', due_date: '' });
      alert('Task assigned successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeetings = async () => {
    if (!activeCreator) return;
    try {
      const res = await axios.get(`/api/admin/support/meetings/${activeCreator.id}`, { withCredentials: true });
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMeetingAction = async (status: string) => {
    if (!activeMeeting) return;
    try {
      await axios.put(`/api/admin/support/meetings/${activeMeeting.id}`, { status, meeting_link: meetLink }, { withCredentials: true });
      setShowMeetModal(false);
      setMeetLink('');
      setActiveMeeting(null);
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCreators = creators.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 text-white overflow-hidden bg-black/40">
      
      {/* Sidebar: Creators List */}
      <div className="w-80 border-r border-border flex flex-col bg-white/5">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Creators
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search creators..."
              className="w-full bg-black/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredCreators.map(creator => (
            <button
              key={creator.id}
              onClick={() => setActiveCreator(creator)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-colors text-left ${activeCreator?.id === creator.id ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center shrink-0 border border-white/10">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-sm truncate">{creator.name}</div>
                <div className="text-xs text-gray-400 truncate">{creator.email}</div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeCreator?.id === creator.id ? 'text-primary' : 'text-gray-500'}`} />
            </button>
          ))}
          {filteredCreators.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">No creators found.</div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeCreator ? (
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center px-6 shrink-0 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{activeCreator.name}</h3>
                <p className="text-xs text-gray-400">Managing Creator</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 border-b border-border bg-black/20 shrink-0 overflow-x-auto">
            {[
              { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
              { id: 'chat', label: 'Direct Chat', icon: MessageCircle },
              { id: 'tasks', label: 'Assign Tasks', icon: CheckSquare },
              { id: 'meetings', label: 'Meetings', icon: Calendar },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* TICKETS TAB */}
            {activeTab === 'tickets' && (
              <div className="absolute inset-0 flex">
                <div className="w-1/3 border-r border-border overflow-y-auto p-4 space-y-3 bg-black/20">
                  {tickets.map(ticket => (
                    <button
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${activeTicket?.id === ticket.id ? 'bg-primary/10 border-primary/50' : 'bg-white/5 border-border hover:bg-white/10'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          ticket.status === 'Open' ? 'bg-blue-500/20 text-blue-400' : 
                          ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {ticket.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-semibold text-sm truncate">{ticket.subject}</h4>
                      <p className="text-xs text-gray-400 truncate mt-1">{ticket.platform} • {ticket.category}</p>
                    </button>
                  ))}
                  {tickets.length === 0 && <div className="text-center text-sm text-gray-500 mt-10">No tickets found.</div>}
                </div>

                <div className="flex-1 flex flex-col bg-black/40">
                  {activeTicket ? (
                    <>
                      <div className="p-4 border-b border-border bg-white/5 flex items-center justify-between shrink-0">
                        <div>
                          <h3 className="font-bold">{activeTicket.subject}</h3>
                          <p className="text-xs text-gray-400">{activeTicket.category} • Priority: {activeTicket.priority}</p>
                        </div>
                        {activeTicket.status !== 'Resolved' && (
                          <button onClick={handleResolveTicket} className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors">
                            Mark Resolved
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Initial Message */}
                        <div className="flex flex-col max-w-[85%] self-start items-start">
                          <span className="text-xs text-gray-500 mb-1 ml-1">Creator • {new Date(activeTicket.created_at).toLocaleString()}</span>
                          <div className="px-4 py-2.5 rounded-2xl text-sm bg-white/10 text-white rounded-tl-sm">
                            {activeTicket.message}
                          </div>
                        </div>

                        {/* Replies */}
                        {ticketMessages.map((msg, i) => {
                          const isManager = msg.sender_role === 'MANAGER' || msg.sender_role === 'ADMIN';
                          return (
                            <div key={i} className={`flex flex-col max-w-[85%] ${isManager ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
                              <span className={`text-xs text-gray-500 mb-1 ${isManager ? 'mr-1' : 'ml-1'}`}>
                                {isManager ? 'You' : msg.sender_role} • {new Date(msg.created_at).toLocaleString()}
                              </span>
                              <div className={`px-4 py-2.5 rounded-2xl text-sm ${isManager ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                {msg.message}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={ticketBottomRef} />
                      </div>

                      <div className="p-4 border-t border-border bg-black/60 shrink-0">
                        <form onSubmit={handleSendTicketMessage} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                            placeholder="Type a response..."
                            value={newTicketMsg}
                            onChange={e => setNewTicketMsg(e.target.value)}
                            disabled={activeTicket.status === 'Resolved'}
                          />
                          <button 
                            type="submit" 
                            disabled={!newTicketMsg.trim() || activeTicket.status === 'Resolved'}
                            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      Select a ticket to view details
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="absolute inset-0 flex flex-col bg-black/20">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                      <MessageCircle className="w-12 h-12 opacity-20" />
                      <p>Start a direct conversation with {activeCreator.name}</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => {
                      const isManager = msg.sender_role === 'MANAGER' || msg.sender_role === 'ADMIN';
                      return (
                        <div key={i} className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isManager ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
                          <span className={`text-xs text-gray-500 mb-1 ${isManager ? 'mr-1' : 'ml-1'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${isManager ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-white border border-border rounded-tl-sm'}`}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>
                <div className="p-4 border-t border-border bg-black/60 shrink-0">
                  <form onSubmit={handleSendChat} className="flex items-center gap-3">
                    <input 
                      type="text" 
                      className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="Message creator..."
                      value={newChatMsg}
                      onChange={e => setNewChatMsg(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={!newChatMsg.trim()}
                      className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="absolute inset-0 overflow-y-auto p-6 bg-black/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Assigned Tasks</h3>
                  <button 
                    onClick={() => setShowTaskModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Assign New Task
                  </button>
                </div>
                
                {/* Simplified task list since admins don't fetch tasks in the backend yet. Let's assume we can fetch them via a quick add to admin.js, or just use a placeholder text if not fully integrated. */}
                <div className="text-gray-400 text-sm p-8 text-center bg-white/5 border border-border rounded-2xl">
                  (Tasks feature ready to be assigned. Go ahead and assign one!)
                </div>
              </div>
            )}

            {/* MEETINGS TAB */}
            {activeTab === 'meetings' && (
              <div className="absolute inset-0 overflow-y-auto p-6 bg-black/20">
                <h3 className="font-bold text-lg mb-6">Meeting Requests</h3>
                <div className="space-y-4">
                  {meetings.map(m => (
                    <div key={m.id} className="bg-white/5 border border-border rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg">{m.title}</h4>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                            m.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                            m.status === 'Requested' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(m.meeting_date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {m.meeting_time}</span>
                        </div>
                        {m.notes && <p className="text-sm text-gray-300 bg-black/30 p-3 rounded-xl border border-white/5 inline-block">"{m.notes}"</p>}
                      </div>
                      
                      {m.status === 'Requested' && (
                        <div className="flex items-center gap-3 md:self-center">
                          <button 
                            onClick={() => { setActiveMeeting(m); setShowMeetModal(true); }}
                            className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold hover:bg-green-500/30 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => { setActiveMeeting(m); handleMeetingAction('Rejected'); }}
                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {m.status === 'Confirmed' && m.meeting_link && (
                        <div className="md:self-center">
                          <a href={m.meeting_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors">
                            <Video className="w-4 h-4" /> Join Google Meet
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  {meetings.length === 0 && <div className="text-gray-500 text-center mt-10">No meetings requested.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <Users className="w-16 h-16 opacity-20 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Support & Talent Manager</h2>
          <p>Select a creator from the sidebar to manage their account.</p>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-border rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Assign Task to {activeCreator?.name}</h2>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
                <input type="text" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meet Modal */}
      {showMeetModal && activeMeeting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-border rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Approve Meeting</h2>
            <p className="text-sm text-gray-400 mb-6">Attach a Google Meet link for this session.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Google Meet Link</label>
                <input type="url" placeholder="https://meet.google.com/xxx-xxxx-xxx" required value={meetLink} onChange={e => setMeetLink(e.target.value)} className="w-full bg-black border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowMeetModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-xl">Cancel</button>
                <button onClick={() => handleMeetingAction('Confirmed')} disabled={!meetLink.trim()} className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 rounded-xl font-semibold disabled:opacity-50">Approve & Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
