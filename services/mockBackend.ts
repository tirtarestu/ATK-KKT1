import { Barang, Permintaan, User, LogAktivitas, Mutasi } from '../types';

/**
 * This service mimics the backend logic (Controllers + Database) provided in the prompt.
 * It uses localStorage to persist data so the app is functional without a running Node server.
 */

const STORAGE_KEYS = {
  USERS: 'atk_users',
  BARANG: 'atk_barang',
  PERMINTAAN: 'atk_permintaan',
  MUTASI: 'atk_mutasi',
  LOGS: 'atk_logs',
};

// Initial Seed Data
const INITIAL_USERS: User[] = [
  { id: 1, nama: 'Admin System', email: 'admin@atk.com', role: 'admin' },
  { id: 2, nama: 'Budi Staff', email: 'budi@atk.com', role: 'user' },
  { id: 3, nama: 'Siti Staff', email: 'siti@atk.com', role: 'user' },
];

// Master Data Barang (72 Items from PDF)
const INITIAL_BARANG: Barang[] = [
  { id: 1, kode_barang: 'ATK-001', nama_barang: 'Amplop', kategori: 'Kertas & Amplop', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, kode_barang: 'ATK-002', nama_barang: 'Binder Clip Ukuran 105 (Joyko)', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, kode_barang: 'ATK-003', nama_barang: 'Binder Clip Ukuran 111 (Joyko)', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, kode_barang: 'ATK-004', nama_barang: 'Binder Clip Ukuran 255 (Joyko)', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, kode_barang: 'ATK-005', nama_barang: 'Binder Clip UN1U', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, kode_barang: 'ATK-006', nama_barang: 'Buku Folio isi 100 Lembar', kategori: 'Buku & Kertas', stok: 50, satuan: 'Dos', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, kode_barang: 'ATK-007', nama_barang: 'Buku Folio isi 200 Lembar', kategori: 'Buku & Kertas', stok: 50, satuan: 'Buah', lokasi_simpan: 'Gudang Utama', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, kode_barang: 'ATK-008', nama_barang: 'Catridge Canon 810', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 9, kode_barang: 'ATK-009', nama_barang: 'Catridge Canon 811', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 10, kode_barang: 'ATK-010', nama_barang: 'Catridge Canon 740', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 11, kode_barang: 'ATK-011', nama_barang: 'Catridge Canon 741', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 12, kode_barang: 'ATK-012', nama_barang: 'Catridge Canon 745', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 13, kode_barang: 'ATK-013', nama_barang: 'Catridge Canon 746', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 14, kode_barang: 'ATK-014', nama_barang: 'Catridge Canon 88', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 15, kode_barang: 'ATK-015', nama_barang: 'Catridge Canon 98', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 16, kode_barang: 'ATK-016', nama_barang: 'Cutter Besar', kategori: 'Alat Potong', stok: 20, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 17, kode_barang: 'ATK-017', nama_barang: 'Document Keeper isi 60', kategori: 'Pengarsipan', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Arsip', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 18, kode_barang: 'ATK-018', nama_barang: 'Dos Arsip', kategori: 'Pengarsipan', stok: 50, satuan: 'Buah', lokasi_simpan: 'Rak Arsip', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 19, kode_barang: 'ATK-019', nama_barang: 'Double Tape Busa (3M Original)', kategori: 'Perekat', stok: 20, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 20, kode_barang: 'ATK-020', nama_barang: 'Double Tape Besar', kategori: 'Perekat', stok: 20, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 21, kode_barang: 'ATK-021', nama_barang: 'Gunting Besar', kategori: 'Alat Potong', stok: 15, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 22, kode_barang: 'ATK-022', nama_barang: 'Isi Cutter Besar (Kenko L500)', kategori: 'Alat Potong', stok: 50, satuan: 'Tube', lokasi_simpan: 'Laci Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 23, kode_barang: 'ATK-023', nama_barang: 'Isi Staples Besar', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Laci Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 24, kode_barang: 'ATK-024', nama_barang: 'Isi Staples Kecil', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Dos', lokasi_simpan: 'Laci Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 25, kode_barang: 'ATK-025', nama_barang: 'Kardus Besar (Gudang Garam)', kategori: 'Packing', stok: 50, satuan: 'Buah', lokasi_simpan: 'Gudang Belakang', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 26, kode_barang: 'ATK-026', nama_barang: 'Kertas A4 70 gr (Sinar Dunia)', kategori: 'Kertas', stok: 100, satuan: 'Rim', lokasi_simpan: 'Rak Kertas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 27, kode_barang: 'ATK-027', nama_barang: 'Kertas F4 70 gr (Sinar Dunia)', kategori: 'Kertas', stok: 100, satuan: 'Rim', lokasi_simpan: 'Rak Kertas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 28, kode_barang: 'ATK-028', nama_barang: 'Kertas Buram F4', kategori: 'Kertas', stok: 50, satuan: 'Pack', lokasi_simpan: 'Rak Kertas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 29, kode_barang: 'ATK-029', nama_barang: 'Kertas Termal Antrian (Print Tech 80x80)', kategori: 'Kertas', stok: 50, satuan: 'Roll', lokasi_simpan: 'Rak Kertas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 30, kode_barang: 'ATK-030', nama_barang: 'Lakban Bening Besar', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 31, kode_barang: 'ATK-031', nama_barang: 'Lakban Bening Kecil', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 32, kode_barang: 'ATK-032', nama_barang: 'Lakban Coklat', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 33, kode_barang: 'ATK-033', nama_barang: 'Lakban Hitam Ukuran Besar', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 34, kode_barang: 'ATK-034', nama_barang: 'Lakban Kertas Besar', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 35, kode_barang: 'ATK-035', nama_barang: 'Lakban Kertas Kecil', kategori: 'Perekat', stok: 30, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 36, kode_barang: 'ATK-036', nama_barang: 'Lem Kertas Cair', kategori: 'Perekat', stok: 40, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 37, kode_barang: 'ATK-037', nama_barang: 'Lem Stick Kecil (UHU)', kategori: 'Perekat', stok: 40, satuan: 'Buah', lokasi_simpan: 'Rak Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 38, kode_barang: 'ATK-038', nama_barang: 'Map Resleting Bening', kategori: 'Pengarsipan', stok: 50, satuan: 'Buah', lokasi_simpan: 'Rak Map', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 39, kode_barang: 'ATK-039', nama_barang: 'Map Bening', kategori: 'Pengarsipan', stok: 100, satuan: 'Buah', lokasi_simpan: 'Rak Map', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 40, kode_barang: 'ATK-040', nama_barang: 'Materai 10000', kategori: 'Umum', stok: 100, satuan: 'Lembar', lokasi_simpan: 'Brankas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 41, kode_barang: 'ATK-041', nama_barang: 'Odner Hitam (Bantex)', kategori: 'Pengarsipan', stok: 20, satuan: 'Buah', lokasi_simpan: 'Rak Arsip', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 42, kode_barang: 'ATK-042', nama_barang: 'Paper Clip', kategori: 'Pengikat & Penjepit', stok: 50, satuan: 'Buah', lokasi_simpan: 'Laci Meja', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 43, kode_barang: 'ATK-043', nama_barang: 'Papan Scanner', kategori: 'Elektronik', stok: 5, satuan: 'Buah', lokasi_simpan: 'Lemari Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 44, kode_barang: 'ATK-044', nama_barang: 'Penggaris Besi 30 cm', kategori: 'Alat Ukur', stok: 20, satuan: 'Buah', lokasi_simpan: 'Laci Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 45, kode_barang: 'ATK-045', nama_barang: 'Post It Sign Here', kategori: 'Kertas', stok: 50, satuan: 'Pack', lokasi_simpan: 'Laci Meja', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 46, kode_barang: 'ATK-046', nama_barang: 'Post It Bolak Balik', kategori: 'Kertas', stok: 50, satuan: 'Pack', lokasi_simpan: 'Laci Meja', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 47, kode_barang: 'ATK-047', nama_barang: 'Post It Warna', kategori: 'Kertas', stok: 50, satuan: 'Pack', lokasi_simpan: 'Laci Meja', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 48, kode_barang: 'ATK-048', nama_barang: 'Pulpen Hitam (Standard ST 009)', kategori: 'Alat Tulis', stok: 100, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 49, kode_barang: 'ATK-049', nama_barang: 'Pulpen Hitam (Snowman V-5)', kategori: 'Alat Tulis', stok: 50, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 50, kode_barang: 'ATK-050', nama_barang: 'Pulpen Hitam (Kenko K-1)', kategori: 'Alat Tulis', stok: 50, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 51, kode_barang: 'ATK-051', nama_barang: 'Pulpen Hitam (Zebra 0.7)', kategori: 'Alat Tulis', stok: 50, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 52, kode_barang: 'ATK-052', nama_barang: 'Pulpen Permanent (Snowman 0.5)', kategori: 'Alat Tulis', stok: 30, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 53, kode_barang: 'ATK-053', nama_barang: 'Pulpen Tanda Tangan Hitam (Pilot Balliner)', kategori: 'Alat Tulis', stok: 30, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 54, kode_barang: 'ATK-054', nama_barang: 'Pulpen Tempel Meja', kategori: 'Alat Tulis', stok: 20, satuan: 'Buah', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 55, kode_barang: 'ATK-055', nama_barang: 'Spidol Whiteboard Hitam', kategori: 'Alat Tulis', stok: 50, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 56, kode_barang: 'ATK-056', nama_barang: 'Spidol Whiteboard Merah', kategori: 'Alat Tulis', stok: 50, satuan: 'Dos', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 57, kode_barang: 'ATK-057', nama_barang: 'Stabilo', kategori: 'Alat Tulis', stok: 30, satuan: 'Buah', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 58, kode_barang: 'ATK-058', nama_barang: 'Staples Besar (Max)', kategori: 'Pengikat & Penjepit', stok: 15, satuan: 'Buah', lokasi_simpan: 'Lemari Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 59, kode_barang: 'ATK-059', nama_barang: 'Staples Kecil (Max)', kategori: 'Pengikat & Penjepit', stok: 15, satuan: 'Buah', lokasi_simpan: 'Lemari Alat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 60, kode_barang: 'ATK-060', nama_barang: 'Tinta Refill Black (MFC3720)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 61, kode_barang: 'ATK-061', nama_barang: 'Tinta Refill Yellow (MFC3720)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 62, kode_barang: 'ATK-062', nama_barang: 'Tinta Refill Cyan (MFC3720)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 63, kode_barang: 'ATK-063', nama_barang: 'Tinta Refill Magenta (MFC3720)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 64, kode_barang: 'ATK-064', nama_barang: 'Catridge Brother LC 3617BK (Black)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 65, kode_barang: 'ATK-065', nama_barang: 'Catridge Brother LC 3617M (Magenta)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 66, kode_barang: 'ATK-066', nama_barang: 'Catridge Brother LC 3617Y (Yellow)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 67, kode_barang: 'ATK-067', nama_barang: 'Catridge Brother LC 3617C (Cyan)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Buah', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 68, kode_barang: 'ATK-068', nama_barang: 'Tipe X', kategori: 'Alat Tulis', stok: 50, satuan: 'Buah', lokasi_simpan: 'Lemari ATK', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 69, kode_barang: 'ATK-069', nama_barang: 'Tinta Printer Hitam (Veneta)', kategori: 'Tinta & Toner', stok: 10, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 70, kode_barang: 'ATK-070', nama_barang: 'Tinta Refill Hitam Epson 003 (Black)', kategori: 'Tinta & Toner', stok: 20, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 71, kode_barang: 'ATK-071', nama_barang: 'Tinta Refill Cyan Epson 003 (Cyan)', kategori: 'Tinta & Toner', stok: 20, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 72, kode_barang: 'ATK-072', nama_barang: 'Tinta Refill Yellow Epson 003 (Yellow)', kategori: 'Tinta & Toner', stok: 20, satuan: 'Botol', lokasi_simpan: 'Lemari Tinta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// Helper to get data
const get = <T>(key: string, initial: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  
  // SPECIAL LOGIC: 
  // If we are getting BARANG, and the data in local storage is the old small dataset (<= 3 items), 
  // or differs significantly from our new big master data, force update it.
  if (key === STORAGE_KEYS.BARANG) {
    const parsed = JSON.parse(data) as any[];
    if (parsed.length <= 3) {
      // Force migration to new master data
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
  }

  return JSON.parse(data);
};

// Helper to set data
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// --- Auth Service ---
export const loginByEmail = async (email: string): Promise<User> => {
  const users = get<User>(STORAGE_KEYS.USERS, INITIAL_USERS);
  // Find user by email (case insensitive)
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('Email tidak terdaftar dalam sistem.');
  }
  
  return user;
};

// --- Logger ---
const createLog = (userId: number, aktivitas: string, detail: string) => {
  const logs = get<LogAktivitas>(STORAGE_KEYS.LOGS, []);
  const users = get<User>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const user = users.find(u => u.id === userId);
  
  const newLog: LogAktivitas = {
    id: Date.now(),
    user_id: userId,
    user_nama: user?.nama || 'Unknown',
    aktivitas,
    detail,
    created_at: new Date().toISOString()
  };
  set(STORAGE_KEYS.LOGS, [newLog, ...logs]);
};

// --- User Management Logic (New) ---
export const getUsers = async (): Promise<User[]> => {
  return get<User>(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const addUser = async (userData: Omit<User, 'id'>, adminId: number): Promise<User> => {
  const users = await getUsers();
  // Check duplicate email
  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error('Email sudah digunakan oleh user lain.');
  }

  const newUser: User = {
    ...userData,
    id: Date.now(),
  };
  set(STORAGE_KEYS.USERS, [...users, newUser]);
  createLog(adminId, 'Tambah User', `Menambahkan user baru: ${newUser.nama} (${newUser.role})`);
  return newUser;
};

export const updateUser = async (id: number, updates: Partial<User>, adminId: number): Promise<User> => {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');

  // Check duplicate email if email is being updated
  if (updates.email && updates.email !== users[index].email) {
     if (users.some(u => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== id)) {
      throw new Error('Email sudah digunakan oleh user lain.');
    }
  }

  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  set(STORAGE_KEYS.USERS, users);
  createLog(adminId, 'Edit User', `Mengubah data user: ${updatedUser.nama}`);
  return updatedUser;
};

export const deleteUser = async (id: number, adminId: number): Promise<void> => {
  const users = await getUsers();
  const userToDelete = users.find(u => u.id === id);
  if (!userToDelete) return;

  const newUsers = users.filter(u => u.id !== id);
  set(STORAGE_KEYS.USERS, newUsers);
  createLog(adminId, 'Hapus User', `Menghapus user: ${userToDelete.nama}`);
};

// --- Barang Controller Logic ---
export const getBarang = async (): Promise<Barang[]> => {
  return get<Barang>(STORAGE_KEYS.BARANG, INITIAL_BARANG);
};

export const addBarang = async (item: Omit<Barang, 'id' | 'created_at' | 'updated_at'>, userId: number): Promise<Barang> => {
  const items = await getBarang();
  const newItem: Barang = {
    ...item,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  set(STORAGE_KEYS.BARANG, [...items, newItem]);
  createLog(userId, 'Tambah Barang', `Tambah ${item.nama_barang}`);
  return newItem;
};

export const updateBarang = async (id: number, updates: Partial<Barang>, userId: number): Promise<Barang> => {
  const items = await getBarang();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Barang not found');
  
  const updatedItem = { ...items[index], ...updates, updated_at: new Date().toISOString() };
  items[index] = updatedItem;
  set(STORAGE_KEYS.BARANG, items);
  createLog(userId, 'Edit Barang', `Edit ${updatedItem.nama_barang}`);
  return updatedItem;
};

export const deleteBarang = async (id: number, userId: number): Promise<void> => {
  const items = await getBarang();
  const item = items.find(i => i.id === id);
  if (!item) return;

  // Cascade Soft Delete: Cancel pending requests for this item
  const reqs = get<Permintaan>(STORAGE_KEYS.PERMINTAAN, []);
  let requestsCancelledCount = 0;
  
  const updatedReqs = reqs.map(r => {
    if (r.barang_id === id && r.status === 'pending') {
      requestsCancelledCount++;
      return { ...r, status: 'ditolak', catatan: 'Barang dihapus dari sistem (Auto-cancel)' } as Permintaan;
    }
    return r;
  });

  if (requestsCancelledCount > 0) {
    set(STORAGE_KEYS.PERMINTAAN, updatedReqs);
  }
  
  const newItems = items.filter(i => i.id !== id);
  set(STORAGE_KEYS.BARANG, newItems);
  
  const detailLog = requestsCancelledCount > 0 
    ? `Hapus ${item.nama_barang} (Auto-cancel ${requestsCancelledCount} req pending)`
    : `Hapus ${item.nama_barang}`;
    
  createLog(userId, 'Hapus Barang', detailLog);
};

// --- Permintaan Controller Logic ---
export const getPermintaan = async (userId?: number): Promise<Permintaan[]> => {
  const allReqs = get<Permintaan>(STORAGE_KEYS.PERMINTAAN, []);
  const users = get<User>(STORAGE_KEYS.USERS, INITIAL_USERS);
  const items = get<Barang>(STORAGE_KEYS.BARANG, INITIAL_BARANG);

  // Join data for display
  const joined = allReqs.map(r => ({
    ...r,
    user_nama: users.find(u => u.id === r.user_id)?.nama || 'Unknown User',
    barang_nama: items.find(i => i.id === r.barang_id)?.nama_barang || 'Unknown Item'
  }));

  if (userId) {
    return joined.filter(r => r.user_id === userId);
  }
  return joined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createPermintaan = async (barangId: number, jumlah: number, catatan: string, userId: number) => {
  const items = await getBarang();
  const barang = items.find(i => i.id === barangId);
  if (!barang) throw new Error('Barang not found');
  
  const newReq: Permintaan = {
    id: Date.now(),
    user_id: userId,
    barang_id: barangId,
    jumlah_minta: jumlah,
    status: 'pending',
    catatan,
    created_at: new Date().toISOString()
  };
  
  const existing = get<Permintaan>(STORAGE_KEYS.PERMINTAAN, []);
  set(STORAGE_KEYS.PERMINTAAN, [...existing, newReq]);
  createLog(userId, 'Permintaan Barang', `Minta ${jumlah} ${barang.nama_barang}`);
};

export const approvePermintaan = async (reqId: number, adminId: number, qtyToApprove?: number) => {
  const reqs = get<Permintaan>(STORAGE_KEYS.PERMINTAAN, []);
  const reqIndex = reqs.findIndex(r => r.id === reqId);
  if (reqIndex === -1) throw new Error('Request not found');
  
  const request = reqs[reqIndex];
  if (request.status !== 'pending') throw new Error('Request already processed');
  
  const items = await getBarang();
  const itemIndex = items.findIndex(i => i.id === request.barang_id);
  
  if (itemIndex === -1) throw new Error('Barang sudah dihapus');

  // Determine final quantity
  const finalQty = qtyToApprove ? qtyToApprove : request.jumlah_minta;

  if (finalQty <= 0) throw new Error('Jumlah disetujui harus lebih dari 0');

  if (items[itemIndex].stok < finalQty) {
    throw new Error('Stok tidak cukup');
  }

  // Update request if quantity changed by admin
  if (qtyToApprove && qtyToApprove !== request.jumlah_minta) {
     const oldQty = request.jumlah_minta;
     reqs[reqIndex].jumlah_minta = finalQty;
     reqs[reqIndex].catatan = `${reqs[reqIndex].catatan || ''} (Qty disesuaikan Admin dari ${oldQty} ke ${finalQty})`.trim();
  }

  // 1. Kurangi Stok
  items[itemIndex].stok -= finalQty;
  items[itemIndex].updated_at = new Date().toISOString();
  set(STORAGE_KEYS.BARANG, items);

  // 2. Update Status Permintaan
  reqs[reqIndex].status = 'disetujui';
  set(STORAGE_KEYS.PERMINTAAN, reqs);

  // 3. Create Mutasi
  const mutasi: Mutasi = {
    id: Date.now(),
    barang_id: request.barang_id,
    tipe_mutasi: 'keluar',
    jumlah: finalQty,
    keterangan: `Approve permintaan #${request.id}`,
    user_id: adminId,
    created_at: new Date().toISOString()
  };
  const mutations = get<Mutasi>(STORAGE_KEYS.MUTASI, []);
  set(STORAGE_KEYS.MUTASI, [...mutations, mutasi]);

  // 4. Log
  createLog(adminId, 'Approve Permintaan', `Approve permintaan #${request.id} (${finalQty} items)`);
};

export const rejectPermintaan = async (reqId: number, adminId: number, reason: string) => {
  const reqs = get<Permintaan>(STORAGE_KEYS.PERMINTAAN, []);
  const idx = reqs.findIndex(r => r.id === reqId);
  if (idx > -1) {
    reqs[idx].status = 'ditolak';
    // Append reason to existing note
    const previousNote = reqs[idx].catatan ? `(Note User: ${reqs[idx].catatan})` : '';
    reqs[idx].catatan = `Ditolak: ${reason} ${previousNote}`;
    
    set(STORAGE_KEYS.PERMINTAAN, reqs);
    createLog(adminId, 'Reject Permintaan', `Tolak permintaan #${reqId}. Alasan: ${reason}`);
  }
};

// --- Mutasi Controller Logic (New) ---
export const getMutasi = async (): Promise<(Mutasi & { barang_nama?: string, user_nama?: string })[]> => {
  const mutations = get<Mutasi>(STORAGE_KEYS.MUTASI, []);
  const items = get<Barang>(STORAGE_KEYS.BARANG, INITIAL_BARANG);
  const users = get<User>(STORAGE_KEYS.USERS, INITIAL_USERS);

  return mutations.map(m => ({
    ...m,
    barang_nama: items.find(i => i.id === m.barang_id)?.nama_barang || 'Unknown',
    user_nama: users.find(u => u.id === m.user_id)?.nama || 'Unknown'
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getLogs = async (): Promise<LogAktivitas[]> => {
  return get<LogAktivitas>(STORAGE_KEYS.LOGS, []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};