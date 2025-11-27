
import React, { useEffect, useState } from 'react';
import { Permintaan, User, Barang } from '../types';
import * as api from '../services/mockBackend';
import { Plus, Clock, Check, X, MapPin, Search, AlertCircle } from 'lucide-react';

interface Props {
  user: User;
  onNavigate: (page: string) => void;
}

export const UserDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const [myRequests, setMyRequests] = useState<Permintaan[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.getPermintaan(user.id);
      setMyRequests(data);
    };
    load();
  }, [user.id]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Halo, {user.nama} 👋</h1>
          <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">Selamat datang di portal Inventaris. Ajukan kebutuhan ATK Anda dengan mudah dan pantau statusnya secara real-time.</p>
          
          <button 
            onClick={() => onNavigate('request_form')}
            className="mt-8 bg-white text-indigo-700 px-7 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg shadow-indigo-900/20 hover:scale-105 inline-flex items-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Buat Permintaan Baru
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="text-indigo-500" size={24} />
          Riwayat Permintaan Saya
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
           Total: {myRequests.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myRequests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 uppercase
                ${req.status === 'disetujui' ? 'bg-emerald-100 text-emerald-700' : 
                  req.status === 'ditolak' ? 'bg-rose-100 text-rose-700' : 
                  'bg-amber-100 text-amber-700'}`}>
                 {req.status === 'disetujui' && <Check size={14} />}
                 {req.status === 'pending' && <Clock size={14} />}
                 {req.status === 'ditolak' && <X size={14} />}
                 {req.status}
              </span>
              <span className="text-xs font-medium text-slate-400">{new Date(req.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</span>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">{req.barang_nama}</h3>
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-sm text-slate-500">Jumlah:</span>
                 <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-sm">{req.jumlah_minta}</span>
              </div>
              
              {req.catatan && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-sm italic">"{req.catatan}"</p>
                </div>
              )}
            </div>

            {/* Pesan Instruksi Pengambilan Barang */}
            {req.status === 'disetujui' && (
              <div className="mt-5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <div className="bg-emerald-200 p-1.5 rounded-full text-emerald-700 mt-0.5">
                   <MapPin size={14} />
                </div>
                <p className="text-sm text-emerald-800 font-medium leading-tight">
                  Silahkan ambil barang di <span className="font-bold">Divisi SDM & Umum</span>.
                </p>
              </div>
            )}
          </div>
        ))}
        {myRequests.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Belum ada permintaan</h3>
            <p className="text-slate-500 mt-1">Anda belum pernah mengajukan permintaan barang.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const RequestForm: React.FC<{ user: User; onSuccess: () => void }> = ({ user, onSuccess }) => {
  const [items, setItems] = useState<Barang[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    api.getBarang().then(setItems);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem === 0) {
      alert("Pilih barang terlebih dahulu");
      return;
    }
    try {
      await api.createPermintaan(selectedItem, amount, note, user.id);
      alert("Permintaan berhasil dikirim!");
      onSuccess();
    } catch (e) {
      alert("Gagal mengirim permintaan");
    }
  };

  const currentItem = items.find(i => i.id === selectedItem);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-800">Form Permintaan Barang</h1>
        <p className="text-slate-500 mt-2">Isi formulir di bawah untuk mengajukan pengadaan ATK.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Pilih Barang</label>
            <select 
              className="w-full border-slate-200 border rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors cursor-pointer"
              value={selectedItem}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
            >
              <option value={0}>-- Pilih Barang ATK --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.nama_barang} (Sisa Stok: {item.stok} {item.satuan})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Jumlah Permintaan</label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                min="1"
                max={currentItem ? currentItem.stok : 100}
                className="w-full border-slate-200 border rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              {currentItem && (
                <span className="text-slate-500 font-medium whitespace-nowrap bg-slate-100 px-4 py-3.5 rounded-xl border border-slate-200">
                  {currentItem.satuan}
                </span>
              )}
            </div>
            {currentItem && amount > currentItem.stok && (
              <p className="text-rose-500 text-xs mt-2 font-medium flex items-center gap-1">
                 <AlertCircle size={12} /> Jumlah melebihi stok tersedia ({currentItem.stok})
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Catatan / Keperluan</label>
            <textarea 
              rows={3}
              className="w-full border-slate-200 border rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-colors resize-none"
              placeholder="Contoh: Untuk keperluan rapat bulanan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={!selectedItem || (currentItem ? amount > currentItem.stok : true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:bg-none disabled:bg-slate-300 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed transition-all duration-200 mt-4"
          >
            Kirim Permintaan
          </button>
        </form>
      </div>
    </div>
  );
};
