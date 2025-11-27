import React, { useEffect, useState } from 'react';
import { User, Role } from '../types';
import * as api from '../services/mockBackend';
import { Plus, Edit2, Trash2, Search, User as UserIcon, Shield, Mail } from 'lucide-react';

interface Props {
  currentUser: User;
}

export const UserManagement: React.FC<Props> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
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
    if (user) {
      setEditingUser(user);
      setFormData({
        nama: user.nama,
        email: user.email,
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        nama: '',
        email: '',
        role: 'user'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData, currentUser.id);
      } else {
        await api.addUser(formData, currentUser.id);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau email user..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid Cards for Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {user.role === 'admin' ? <Shield size={24} /> : <UserIcon size={24} />}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className={`p-2 rounded-lg transition ${user.id === currentUser.id ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                    disabled={user.id === currentUser.id}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900">{user.nama}</h3>
              
              <div className="mt-4 space-y-2">
                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail size={16} />
                    <span>{user.email}</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Shield size={16} />
                    <span className="capitalize">{user.role}</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
               <span>ID: {user.id}</span>
               {user.id === currentUser.id && <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">You</span>}
            </div>
          </div>
        ))}
      </div>

       {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Tidak ada user ditemukan.</p>
          </div>
        )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  required 
                  type="text" 
                  className="w-full border rounded-lg p-2" 
                  value={formData.nama} 
                  onChange={e => setFormData({...formData, nama: e.target.value})} 
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  required 
                  type="email" 
                  className="w-full border rounded-lg p-2" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="email@kantor.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Jabatan</label>
                <select 
                  className="w-full border rounded-lg p-2 bg-white" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value="user">Staff (User)</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Admin memiliki akses penuh, Staff hanya bisa request barang.</p>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};