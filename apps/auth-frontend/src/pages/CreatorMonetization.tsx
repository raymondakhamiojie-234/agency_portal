import { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Camera, Users, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreatorMonetization() {
  const [monetization, setMonetization] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonetization();
  }, []);

  const fetchMonetization = async () => {
    try {
      const res = await axios.get('/api/monetization', { withCredentials: true });
      setMonetization(res.data);
    } catch (err) {
      console.error("Failed to load monetization", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (platform: string) => {
    switch(platform) {
      case 'YOUTUBE': return <Video className="h-6 w-6 text-red-500" />;
      case 'INSTAGRAM': return <Camera className="h-6 w-6 text-pink-500" />;
      case 'FACEBOOK': return <Users className="h-6 w-6 text-blue-500" />;
      case 'TIKTOK': return <Smartphone className="h-6 w-6 text-cyan-400" />;
      default: return <Smartphone className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Monetization Status</h1>
        <p className="text-gray-400 mt-1">Track your eligibility and monetization health across platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-gray-500 py-8">Loading monetization data...</div>
        ) : monetization.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-8">No linked accounts found.</div>
        ) : (
          monetization.map((m) => (
            <div key={m.id} className="bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getIcon(m.platform)}
                  <div>
                    <h3 className="text-white font-medium capitalize">{m.platform.toLowerCase()}</h3>
                    <p className="text-xs text-gray-400">{m.handle}</p>
                  </div>
                </div>
                {m.status === 'ELIGIBLE' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : m.status === 'IN_REVIEW' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Followers/Subs</span>
                  <span className="text-white font-medium">{new Intl.NumberFormat().format(m.current_followers)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium ${
                    m.status === 'ELIGIBLE' ? 'text-green-400' :
                    m.status === 'IN_REVIEW' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
