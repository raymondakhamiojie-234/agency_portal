import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, TrendingUp, Medal, Star, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  account_id: number;
  page_name: string;
  total_earnings: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/leaderboard', {
          withCredentials: true,
        });
        setLeaders(response.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600 group-hover:text-primary/50 transition-colors" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400';
      case 1: return 'bg-gray-400/10 border-gray-400/30 text-gray-400';
      case 2: return 'bg-amber-600/10 border-amber-600/30 text-amber-600';
      default: return 'bg-white/5 border-white/10 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-10 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20"
        >
          <Trophy className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-4"
        >
          Creator Leaderboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Top 10 highest-earning creators for the current month. Keep pushing to reach the top!
        </motion.p>
      </div>

      {/* Podium for Top 3 */}
      {leaders.length >= 3 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 lg:gap-10 mb-16 pt-10">
          {[1, 0, 2].map((rankIndex, i) => {
            const creator = leaders[rankIndex];
            if (!creator) return null;
            
            const heights = ['h-[200px]', 'h-[260px]', 'h-[160px]'];
            const delays = [0.4, 0.3, 0.5];
            const isFirst = rankIndex === 0;

            return (
              <motion.div 
                key={`podium-${creator.account_id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delays[i], type: "spring", stiffness: 100 }}
                className="flex flex-col items-center w-full md:w-1/3 max-w-[220px] mx-auto md:mx-0"
              >
                <div className="flex flex-col items-center mb-4 text-center">
                  {getRankIcon(rankIndex)}
                  <h3 className={`mt-3 font-bold truncate w-full px-2 ${isFirst ? 'text-xl text-white' : 'text-lg text-gray-200'}`}>
                    {creator.page_name}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono mt-1">ID: {creator.account_id}</p>
                </div>
                
                <div className={`w-full ${heights[i]} ${getRankColor(rankIndex)} border-t border-l border-r rounded-t-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,255,0.2)] flex flex-col items-center justify-start pt-6`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  <span className={`text-4xl font-black opacity-20 ${isFirst ? 'text-yellow-400' : isFirst === false && rankIndex === 1 ? 'text-gray-400' : 'text-amber-600'}`}>
                    #{rankIndex + 1}
                  </span>
                  <div className="mt-auto pb-6 text-center w-full px-4">
                    <p className="text-sm text-white/60 mb-1 uppercase tracking-wider font-semibold">Earnings</p>
                    <p className={`font-bold truncate ${isFirst ? 'text-2xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-xl text-white'}`}>
                      ${creator.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List for 4-10 (and fallback if < 3) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="py-5 px-6 text-sm font-semibold text-gray-400 w-24 text-center">Rank</th>
                <th className="py-5 px-6 text-sm font-semibold text-gray-400">Creator details</th>
                <th className="py-5 px-6 text-sm font-semibold text-gray-400 text-right">Monthly Earnings</th>
              </tr>
            </thead>
            <tbody>
              {leaders.slice(leaders.length >= 3 ? 3 : 0).map((creator, idx) => {
                const rank = (leaders.length >= 3 ? 3 : 0) + idx;
                return (
                  <tr 
                    key={`list-${creator.account_id}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-5 px-6 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold group-hover:scale-110 transition-transform">
                        #{rank + 1}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-lg">{creator.page_name}</span>
                        <span className="text-sm text-gray-500 font-mono mt-0.5">Account ID: {creator.account_id}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="inline-flex items-center text-emerald-400 font-bold text-lg bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        ${creator.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {leaders.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                    No earnings recorded for this month yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
