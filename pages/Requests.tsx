import React, { useEffect, useState } from 'react';
import { Permintaan, User } from '../types';
import * as api from '../services/mockBackend';
import { Check, X, Clock, AlertCircle, Edit2, Box } from 'lucide-react';

interface Props {
  user: User;
}

export const Requests: React.FC<Props> = ({ user }) => {
  const [requests, setRequests] = useState<Permintaan[]>([]);
  
  // Rejection Modal State
  const [rejectModal, setRejectModal] = useState({ isOpen: false, reqId: 0 });
  const [rejectReason, setRejectReason] = useState('');

  // Approval Modal State
  const [approveModal, setApproveModal] = useState({ 
    isOpen: false, 
    reqId: 0, 
    originalQty: 0, 
    itemName: '',
    currentStock: 100 // Placeholder, will fetch real stock
  });
  const [approveQty, setApproveQty] = useState(0);

  const loadData = async () => {
    const data = await api.getPermintaan();
    setRequests(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenApproveModal = async (req: Permintaan) => {
    // Need to fetch current stock for this item to show in modal
    const allItems = await api.getBarang();
    const item = allItems.find(i => i.id === req.barang_id);
    const stock = item ? item.stok : 0;

    setApproveModal({
      isOpen: true,
      reqId: req.id,
      originalQty: req.jumlah_minta,
      itemName: req.barang_nama || 'Unknown',
      currentStock: stock
    });
    setApproveQty(req.jumlah_minta);
  };

  const confirmApprove = async () => {
    if (approveQty <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }
    if (approveQty > approveModal.currentStock) {
      alert(`Stok tidak cukup! Hanya tersedia ${approveModal.currentStock}.`);
      return;
    }

    try {
      await api.approvePermintaan(approveModal.reqId, user.id, approveQty);
      setApproveModal({ ...approveModal, isOpen: false });
      loadData();
      // alert('Permintaan disetujui.');
    } catch (error: any) {
      alert(error.message || 'Gagal menyetujui permintaan.');
    }
  };

  const openRejectModal = (id: number) => {
    setRejectModal({ isOpen: true, reqId: id });
    setRejectReason('');
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert("Mohon isi alasan penolakan.");
      return;
    }
    
    try {
      await api.rejectPermintaan(rejectModal.reqId, user.id, rejectReason);
      setRejectModal({ isOpen: false, reqId: 0 });
      loadData();
    } catch (error: any) {
      alert("Gagal menolak permintaan.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Daftar Permintaan ATK</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Tanggal</th>
                <th className="px-6 py-3 font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Barang</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Jumlah</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Catatan</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 font-medium">{req.user_nama}</td>
                  <td className="px-6 py-3">{req.barang_nama}</td>
                  <td className="px-6 py-3">{req.jumlah_minta}</td>
                  <td className="px-6 py-3 text-gray-500 italic">"{req.catatan}"</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${req.status === 'disetujui' ? 'bg-green-100 text-green-700' : 
                        req.status === 'ditolak' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {req.status === 'disetujui' && <Check size={12} />}
                      {req.status === 'ditolak' && <X size={12} />}
                      {req.status === 'pending' && <Clock size={12} />}
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenApproveModal(req)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition flex items-center gap-1"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => openRejectModal(req.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Belum ada permintaan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal (Partial Qty) */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Check className="text-green-600" /> Setujui Permintaan
                </h2>
                <button onClick={() => setApproveModal({ ...approveModal, isOpen: false })} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6 space-y-2 border border-blue-100">
                 <div className="flex justify-between text-sm">
                    <span className="text-blue-700 font-medium">Barang:</span>
                    <span className="font-bold text-gray-700">{approveModal.itemName}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-blue-700 font-medium">Stok Gudang:</span>
                    <span className="font-bold text-gray-700">{approveModal.currentStock} Unit</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-blue-700 font-medium">Permintaan User:</span>
                    <span className="font-bold text-gray-700">{approveModal.originalQty} Unit</span>
                 </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Disetujui</label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    min="1"
                    max={approveModal.currentStock}
                    value={approveQty}
                    onChange={(e) => setApproveQty(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold text-lg text-gray-800"
                  />
                </div>
                {approveQty !== approveModal.originalQty && (
                  <p className="text-xs text-orange-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> Jumlah berbeda dari permintaan awal user ({approveModal.originalQty}).
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setApproveModal({ ...approveModal, isOpen: false })}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmApprove}
                  className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-xl font-bold transition shadow-lg shadow-green-200"
                >
                  Konfirmasi Setuju
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h2 className="text-xl font-bold">Tolak Permintaan</h2>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Silahkan masukkan alasan penolakan. Alasan ini akan muncul di dashboard user.
            </p>

            <textarea 
              autoFocus
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-6 h-32 resize-none"
              placeholder="Contoh: Stok sedang kosong, mohon ajukan minggu depan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRejectModal({ isOpen: false, reqId: 0 })}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition"
              >
                Batal
              </button>
              <button 
                onClick={confirmReject}
                className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium transition shadow-lg shadow-red-200"
              >
                Tolak Permintaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};