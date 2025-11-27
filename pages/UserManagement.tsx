
import React, { useEffect, useState } from 'react';
import { User, Role } from '../types';
import * as api from '../services/mockBackend';
import { Plus, Edit2, Trash2, Search, User as UserIcon, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface Props {
  currentUser: User;
}

export const UserManagement: React.FC<Props> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'user' as Role
  });

  const loadData = async () => {
    const data = await api.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (user?: User) => {
    setShowPassword(false); // Reset password visibility
    if (user) {
      setEditingUser(user);
      setFormData({
        nama: user.nama,
        email: user.email,
        password: '', // Blank by default on edit
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        nama: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Only update password if provided
        const updates: Partial<User> = {
            nama: formData.nama,
            email: formData.email,
            role: formData.role
        };
        if (formData.password) {
            updates.password = formData.password;
        }

        await api.updateUser(editingUser.id, updates, currentUser.id);
      } else {
        if (!formData.password) {
            alert("Password wajib diisi untuk user baru");
            return;
        }
        await api.addUser({
            nama: formData.nama,
            email: formData.email,
            password: formData.password,
            role: formData.role
        }, currentUser.id);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving user");
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      await api.deleteUser(id, currentUser.id);
      loadData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
           <p className="text-gray-500 text-sm mt-1">Kelola akses staff dan administrator sistem.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-medium"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau email user..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Grid Cards for Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {user.role === 'admin' ? <Shield size={24} /> : <UserIcon size={24} />}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className={`p-2 rounded-lg transition-colors ${user.id === currentUser.id ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'}`}
                    disabled={user.id === currentUser.id}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{user.nama}</h3>
              
              <div className="mt-4 space-y-3">
                 <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded-full"><Mail size={14} /></div>
                    <span>{user.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="bg-slate-100 p-1.5 rounded-full"><Shield size={14} /></div>
                    <span className="capitalize font-medium">{user.role}</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
               <span>ID User: {user.id}</span>
               {user.id === currentUser.id && <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">Akun Anda</span>}
            </div>
          </div>
        ))}
      </div>

       {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <Search size={24} />
            </div>
            <p className="text-slate-500 font-medium">Tidak ada user ditemukan.</p>
          </div>
        )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/20">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-xl font-bold text-slate-800">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
                <input 
                  required 
                  type="text" 
                  className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={formData.nama} 
                  onChange={e => setFormData({...formData, nama: e.target.value})} 
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                <input 
                  required 
                  type="email" 
                  className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="email@kantor.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full border-slate-200 border rounded-xl p-3 pl-12 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      placeholder={editingUser ? "•••••••• (Biarkan kosong jika tetap)" : "Masukkan password user"}
                      required={!editingUser}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
                 {editingUser && <p className="text-xs text-slate-400 mt-1.5 ml-1">Biarkan kosong untuk menggunakan password lama.</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Role / Jabatan</label>
                <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                    className="w-full border-slate-200 border rounded-xl p-3 pl-12 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value as Role})}
                    >
                    <option value="user">Staff (User)</option>
                    <option value="admin">Administrator</option>
                    </select>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 ml-1">Admin memiliki akses penuh, Staff hanya bisa request barang.</p>
              </div>
              
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 rounded-xl font-bold transition-all">Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
