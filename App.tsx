
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Inventory } from './pages/Inventory';
import { Requests } from './pages/Requests';
import { Reports } from './pages/Reports';
import { ActivityLogs } from './pages/ActivityLogs';
import { UserManagement } from './pages/UserManagement';
import { UserDashboard, RequestForm } from './pages/UserDashboard';
import { User } from './types';
import * as api from './services/mockBackend';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, User as UserIcon, Package } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  // Login State
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [email, setEmail] = useState('admin@atk.com');
  const [password, setPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (role: 'admin' | 'user') => {
    setActiveTab(role);
    setLoginError('');
    if (role === 'admin') {
      setEmail('admin@atk.com');
      setPassword('123456');
    } else {
      setEmail('budi@atk.com');
      setPassword('123456');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const loggedUser = await api.loginByEmail(email);
      setUser(loggedUser);
      setCurrentPage(loggedUser.role === 'admin' ? 'dashboard' : 'user_dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    handleRoleSwitch('admin');
    setCurrentPage('login');
  };

  // Login Screen (Redesigned)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-75"></div>

        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row relative z-10">
          
          {/* Left Side (Branding) */}
          <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800 p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                 <Package className="text-white w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Inventaris<br/>Pro</h1>
              <p className="text-indigo-100 opacity-90">Sistem Manajemen Aset Kantor Terintegrasi.</p>
            </div>
            <div className="text-sm opacity-60">
              &copy; 2024 Inventaris Corp.
            </div>
          </div>
          
          {/* Right Side (Form) */}
          <div className="md:w-7/12 p-10 bg-white">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500">Silahkan masuk ke akun anda</p>
            </div>

            {/* Role Switcher Pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex mb-8">
              <button
                type="button"
                onClick={() => handleRoleSwitch('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'admin' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Shield size={16} /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('user')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'user' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserIcon size={16} /> Staff
              </button>
            </div>
            
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3 animate-shake">
                <AlertCircle size={18} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    placeholder="nama@kantor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Memproses...' : (
                  <>
                    Masuk Sekarang <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Simple Footer */}
        <div className="absolute bottom-4 text-slate-500 text-xs opacity-50">
           Inventaris ATK System v2.0
        </div>
      </div>
    );
  }

  // Router Logic (Same as before)
  const renderPage = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'dashboard': return <AdminDashboard />;
        case 'inventory': return <Inventory user={user} />;
        case 'requests': return <Requests user={user} />;
        case 'reports': return <Reports />;
        case 'users': return <UserManagement currentUser={user} />;
        case 'logs': return <ActivityLogs />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'user_dashboard': return <UserDashboard user={user} onNavigate={setCurrentPage} />;
        case 'request_form': return <RequestForm user={user} onSuccess={() => setCurrentPage('user_dashboard')} />;
        default: return <UserDashboard user={user} onNavigate={setCurrentPage} />;
      }
    }
  };

  return (
    <Layout user={user} activePage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
};

export default App;
