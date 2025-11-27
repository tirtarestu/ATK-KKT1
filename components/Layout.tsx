
import React from 'react';
import { LayoutDashboard, Package, FileText, History, LogOut, Menu, FileSpreadsheet, Users, ChevronLeft } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, activePage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => {
    const isActive = activePage === page;
    return (
      <button
        onClick={() => onNavigate(page)}
        className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'text-white shadow-lg shadow-indigo-500/30' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        {/* Active Gradient Background */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl" />
        )}
        
        {/* Content */}
        <div className="relative flex items-center gap-3 z-10">
          <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-indigo-400'} transition-colors`} />
          <span className={`font-medium tracking-wide ${!isSidebarOpen && 'hidden'}`}>{label}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } bg-slate-900 flex-shrink-0 transition-all duration-500 ease-in-out flex flex-col fixed h-full z-20 shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-between px-6 mb-2">
          {isSidebarOpen ? (
            <div className="flex flex-col">
               <div className="flex items-center gap-2 text-white">
                <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-2 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight">Inventaris<span className="text-indigo-400">Pro</span></span>
               </div>
               <span className="text-xs text-slate-500 mt-1 pl-1">Office Management System</span>
            </div>
          ) : (
             <div className="w-full flex justify-center">
                <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-2 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
             </div>
          )}
        </div>

        {/* Toggle Button (Absolute) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-9 bg-white p-1.5 rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors z-50"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <Menu size={14} />}
        </button>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 py-4 scrollbar-hide">
          {user.role === 'admin' ? (
            <>
              <div className={`px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Menu Utama' : '---'}
              </div>
              <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem page="inventory" icon={Package} label="Data Barang" />
              <NavItem page="requests" icon={FileText} label="Permintaan" />
              
              <div className={`px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Administrasi' : '---'}
              </div>
              <NavItem page="reports" icon={FileSpreadsheet} label="Laporan Excel" />
              <NavItem page="users" icon={Users} label="Manajemen User" />
              <NavItem page="logs" icon={History} label="Log Aktivitas" />
            </>
          ) : (
            <>
              <div className={`px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Menu Staff' : '---'}
              </div>
              <NavItem page="user_dashboard" icon={LayoutDashboard} label="Beranda" />
              <NavItem page="request_form" icon={FileText} label="Buat Permintaan" />
            </>
          )}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 mx-4 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          {isSidebarOpen && (
            <div className="mb-4 px-2">
              <p className="text-sm font-bold text-white truncate">{user.nama}</p>
              <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide">{user.role}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-24'} p-4`}>
        {/* Content Container with rounded corners */}
        <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-sm border border-slate-100 p-8 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-50 to-white -z-0 pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};
