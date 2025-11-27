
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Barang, Permintaan } from '../types';
import * as api from '../services/mockBackend';
import { AlertCircle, CheckCircle, Clock, Package, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<Barang[]>([]);
  const [requests, setRequests] = useState<Permintaan[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [items, reqs] = await Promise.all([
        api.getBarang(),
        api.getPermintaan()
      ]);
      setInventory(items);
      setRequests(reqs);
    };
    loadData();
  }, []);

  // Stats
  const lowStock = inventory.filter(i => i.stok < 20).length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'disetujui').length;

  // Data for Charts
  const stockData = inventory.map(i => ({ name: i.nama_barang, stok: i.stok })).slice(0, 10);
  
  const statusData = [
    { name: 'Pending', value: pendingRequests },
    { name: 'Disetujui', value: approvedRequests },
    { name: 'Ditolak', value: requests.filter(r => r.status === 'ditolak').length },
  ];

  const COLORS = ['#F59E0B', '#10B981', '#EF4444'];

  const StatCard = ({ title, value, icon: Icon, gradient, subText }: any) => (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-lg border border-white/20 text-white ${gradient}`}>
       {/* Background Decoration */}
       <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
       
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-indigo-100 font-medium mb-1">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
          {subText && <p className="text-xs text-white/70 mt-2 bg-white/10 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">{subText}</p>}
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/10">
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
           <p className="text-slate-500 mt-1">Ringkasan aktivitas dan status inventaris terkini.</p>
        </div>
        <div className="text-sm bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-full shadow-sm font-medium">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Stok Menipis (< 20)" 
          value={lowStock} 
          icon={AlertCircle} 
          gradient="bg-gradient-to-br from-rose-500 to-red-600"
          subText="Perlu restock segera"
        />
        <StatCard 
          title="Permintaan Pending" 
          value={pendingRequests} 
          icon={Clock} 
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          subText="Menunggu persetujuan"
        />
        <StatCard 
          title="Total Jenis Barang" 
          value={inventory.length} 
          icon={Package} 
          gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
          subText="Item terdaftar di sistem"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Level Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><TrendingUp size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800">Level Stok Barang</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#475569'}} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="stok" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Status Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><CheckCircle size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800">Status Permintaan</h3>
          </div>
          <div className="h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
