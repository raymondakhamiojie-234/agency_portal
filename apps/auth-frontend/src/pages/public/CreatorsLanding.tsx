import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Search, ArrowRight, Users, CheckCircle, ExternalLink } from 'lucide-react';

export default function CreatorsLanding() {
  const [slug, setSlug] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      const clean = slug.trim().toLowerCase().replace(/^\//, '');
      navigate(`/${clean}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <div>
              <span className="font-bold text-base tracking-tight text-white">Falcus Media</span>
              <span className="hidden sm:inline-block text-xs text-primary font-medium ml-2 uppercase tracking-wider">
                Creator Network
              </span>
            </div>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center"
          >
            Creator Portal Login <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8 my-auto">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Official Creator Directory & Media Kits
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Partner with Verified <br />
          <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Falcus Media Creators
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Access official media kits, verified audience statistics, and submit sponsorship proposals directly to top digital creators.
        </p>

        {/* Search Creator Form */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto">
          <div className="flex rounded-2xl overflow-hidden border border-white/15 bg-white/[0.03] p-1.5 focus-within:border-primary shadow-2xl transition-all">
            <div className="flex items-center pl-3.5 pr-2 text-gray-500 text-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline-block ml-2 text-gray-500 font-mono text-xs">creators.falcusmedia.com/</span>
            </div>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              placeholder="creator-pagename"
              className="w-full bg-transparent px-2 py-2.5 text-white text-sm focus:outline-none placeholder:text-gray-600"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center shadow-lg shadow-primary/20 flex-shrink-0"
            >
              View Portfolio <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </form>

        {/* Feature Badges */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-400 mb-2" />
            <h2 className="text-xs font-bold text-white">Agency Verified</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Audience & metrics verified directly by Falcus Media management.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <Users className="w-5 h-5 text-primary mb-2" />
            <h2 className="text-xs font-bold text-white">Direct Booking</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Submit campaign briefs and receive quick responses from managers.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <CheckCircle className="w-5 h-5 text-purple-400 mb-2" />
            <h2 className="text-xs font-bold text-white">Custom Packages</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Browse clear sponsorship rates, integrations, and deliverables.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Falcus Media Agency. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-white transition-colors">Creator Portal</Link>
            <span>&bull;</span>
            <Link to="/admin-login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
