
import React, { useEffect, useState } from 'react';
import { Barang, User } from '../types';
import * as api from '../services/mockBackend';
import { exportInventaris } from '../services/excelService';
import { Plus, Edit2, Trash2, Search, Download, Filter } from 'lucide-react';

interface Props {
  user: User;
}

export const Inventory: React.FC<Props> = ({ user }) => {
  const [items, setItems] = useState<Barang[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kategori: '',
    stok: 0,
    satuan: '',
    lokasi_simpan: ''
  });

  const loadData = async () => {
    const data = await api.getBarang();
    setItems(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: Barang) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        kode_barang: item.kode_barang,
        nama_barang: item.nama_barang,
        kategori: item.kategori,
        stok: item.stok,
        satuan: item.satuan,
        lokasi_simpan: item.lokasi_simpan
      });
    } else {
      setEditingItem(null);
      setFormData({
        kode_barang: '',
        nama_barang: '',
        kategori: '',
        stok: 0,
        satuan: '',
        lokasi_simpan: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateBarang(editingItem.id, formData, user.id);
      } else {
        await api.addBarang(formData, user.id);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving data");
    }
  };

  const handleDelete = async (item: Barang) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus barang "${item.nama_barang}"?\n\nSistem akan otomatis membatalkan permintaan PENDING terkait barang ini.`)) {
      try {
        await api.deleteBarang(item.id, user.id);
        
        // Optimistic UI Update immediately
        setItems(prevItems => prevItems.filter(i => i.id !== item.id));
        
        // Then re-fetch to ensure consistency
        loadData();
      } catch (error: any) {
        alert(error.message || "Gagal menghapus barang.");
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
    item.kode_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Barang ATK</h1>
           <p className="text-slate-500 mt-1">Kelola stok dan informasi barang inventaris.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => exportInventaris()}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm"
          >
            <Download size={18} /> Export Excel
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-200 font-bold"
          >
            <Plus size={18} /> Tambah Barang
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau kode barang..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-xl focus:ring-0 text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
            <Filter size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Kode</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Nama Barang</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Kategori</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Stok</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Satuan</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Lokasi</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-indigo-600 bg-opacity-10">{item.kode_barang}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.nama_barang}</td>
                  <td className="px-6 py-4 text-slate-500">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                        {item.kategori}
                      </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${item.stok < 20 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.stok}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.satuan}</td>
                  <td className="px-6 py-4 text-slate-500">{item.lokasi_simpan}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                        <Edit2 size={16} />
                        </button>
                        <button 
                        onClick={() => handleDelete(item)} 
                        className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Hapus Barang"
                        >
                        <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={32} className="opacity-20" />
                        <p>Tidak ada data barang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl scale-100 border border-white/20">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Barang' : 'Tambah Barang'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kode Barang</label>
                  <input required type="text" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.kode_barang} onChange={e => setFormData({...formData, kode_barang: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Barang</label>
                  <input required type="text" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.nama_barang} onChange={e => setFormData({...formData, nama_barang: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori</label>
                  <input type="text" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Stok Awal</label>
                  <input required type="number" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.stok} onChange={e => setFormData({...formData, stok: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Satuan</label>
                  <input type="text" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Lokasi Simpan</label>
                  <input type="text" className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.lokasi_simpan} onChange={e => setFormData({...formData, lokasi_simpan: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 rounded-xl font-bold transition-all">Simpan Barang</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
