export type Role = 'admin' | 'user';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
}

export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  kategori: string;
  stok: number;
  satuan: string;
  lokasi_simpan: string;
  created_at: string;
  updated_at: string;
}

export interface Permintaan {
  id: number;
  user_id: number;
  user_nama?: string; // Joined for display
  barang_id: number;
  barang_nama?: string; // Joined for display
  jumlah_minta: number;
  status: 'pending' | 'disetujui' | 'ditolak';
  catatan: string;
  created_at: string;
}

export interface Mutasi {
  id: number;
  barang_id: number;
  tipe_mutasi: 'masuk' | 'keluar';
  jumlah: number;
  keterangan: string;
  user_id: number;
  created_at: string;
}

export interface LogAktivitas {
  id: number;
  user_id: number;
  user_nama?: string;
  aktivitas: string;
  detail: string;
  created_at: string;
}
