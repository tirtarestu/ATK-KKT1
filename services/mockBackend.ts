import { supabase } from './supabaseClient';
import { Barang, Permintaan, User, LogAktivitas, Mutasi } from '../types';

/**
 * SERVICE BACKEND (SUPABASE VERSION)
 * Menggantikan localStorage dengan panggilan database riil.
 */

// --- AUTH & USER CONTROLLER ---

export const login = async (email: string, pass: string): Promise<User> => {
  // Catatan: Ini adalah "Custom Auth" sederhana menggunakan tabel users sendiri.
  // Untuk production, sangat disarankan menggunakan fitur `supabase.auth.signInWithPassword`.
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) throw new Error('Email tidak ditemukan');
  if (data.password !== pass) throw new Error('Password salah');

  // Hapus password dari objek response demi keamanan di frontend
  const { password, ...userWithoutPass } = data;
  return userWithoutPass as User;
};

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('nama', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data || [];
};

export const addUser = async (newUser: Omit<User, 'id'>, adminId: number) => {
  const { data, error } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) throw new Error(error.message);
  await addLog(adminId, 'Tambah User', `Menambahkan user baru: ${data.nama}`);
  return data;
};

export const updateUser = async (id: number, updates: Partial<User>, adminId: number) => {
  // Logic: Jangan update password jika string kosong
  const finalUpdates = { ...updates };
  if (!finalUpdates.password || finalUpdates.password.trim() === '') {
    delete finalUpdates.password;
  }

  const { data, error } = await supabase
    .from('users')
    .update(finalUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  await addLog(adminId, 'Update User', `Update data user ID: ${id}`);
  return data;
};

export const deleteUser = async (id: number, adminId: number) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await addLog(adminId, 'Hapus User', `Menghapus user ID: ${id}`);
};

// --- BARANG CONTROLLER ---

export const getBarang = async (): Promise<Barang[]> => {
  const { data, error } = await supabase
    .from('barang_atk')
    .select('*')
    .order('nama_barang', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

export const addBarang = async (barang: Omit<Barang, 'id' | 'created_at' | 'updated_at'>, userId: number) => {
  const { data, error } = await supabase
    .from('barang_atk')
    .insert([{
      ...barang,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  await addLog(userId, 'Tambah Barang', `Menambahkan ${barang.nama_barang}`);
  return data;
};

export const updateBarang = async (id: number, updates: Partial<Barang>, userId: number) => {
  const { data, error } = await supabase
    .from('barang_atk')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  await addLog(userId, 'Update Barang', `Update data ${data.nama_barang}`);
  return data;
};

export const deleteBarang = async (id: number, userId: number) => {
  // 1. Ambil nama barang dulu untuk log
  const { data: item } = await supabase.from('barang_atk').select('nama_barang').eq('id', id).single();
  const namaBarang = item?.nama_barang || 'Unknown';

  // 2. Cascade Logic: Batalkan permintaan pending
  // Catatan: Di Supabase real, bisa pakai trigger DB. Di sini kita manual via API.
  await supabase
    .from('permintaan_atk')
    .update({ status: 'ditolak', catatan: 'System: Barang dihapus dari database.' })
    .eq('barang_id', id)
    .eq('status', 'pending');

  // 3. Hapus Barang
  const { error } = await supabase.from('barang_atk').delete().eq('id', id);

  if (error) throw new Error(error.message);
  await addLog(userId, 'Hapus Barang', `Menghapus barang ${namaBarang}`);
};

// --- PERMINTAAN CONTROLLER ---

export const getPermintaan = async (userId?: number): Promise<Permintaan[]> => {
  let query = supabase
    .from('permintaan_atk')
    .select(`
      *,
      users (nama),
      barang_atk (nama_barang)
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Mapping hasil join Supabase ke format flat aplikasi kita
  return data.map((r: any) => ({
    ...r,
    user_nama: r.users?.nama || 'Unknown User',
    barang_nama: r.barang_atk?.nama_barang || 'Unknown Item'
  }));
};

export const createPermintaan = async (barangId: number, jumlah: number, catatan: string, userId: number) => {
  // Cek stok dulu (opsional, tapi bagus)
  const { data: barang } = await supabase.from('barang_atk').select('nama_barang, stok').eq('id', barangId).single();
  if (!barang) throw new Error('Barang tidak ditemukan');

  const { data, error } = await supabase
    .from('permintaan_atk')
    .insert([{
      user_id: userId,
      barang_id: barangId,
      jumlah_minta: jumlah,
      status: 'pending',
      catatan
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  await addLog(userId, 'Buat Permintaan', `Request ${jumlah} ${barang.nama_barang}`);
  return data;
};

export const approvePermintaan = async (reqId: number, adminId: number, approvedQty: number) => {
  // 1. Ambil data permintaan
  const { data: request, error: reqError } = await supabase.from('permintaan_atk').select('*').eq('id', reqId).single();
  if (reqError || !request) throw new Error('Permintaan tidak ditemukan');

  // 2. Ambil data barang & stok
  const { data: barang, error: brgError } = await supabase.from('barang_atk').select('*').eq('id', request.barang_id).single();
  if (brgError || !barang) throw new Error('Barang tidak ditemukan');

  if (barang.stok < approvedQty) throw new Error('Stok gudang tidak mencukupi');

  // 3. Update Stok Barang
  await supabase
    .from('barang_atk')
    .update({ stok: barang.stok - approvedQty })
    .eq('id', barang.id);

  // 4. Update Status Permintaan
  let catatanUpdate = request.catatan;
  if (approvedQty !== request.jumlah_minta) {
     catatanUpdate = `${request.catatan ? request.catatan + ' | ' : ''}Qty disesuaikan admin (Req: ${request.jumlah_minta}, Approved: ${approvedQty})`;
  }

  await supabase
    .from('permintaan_atk')
    .update({ 
      status: 'disetujui',
      jumlah_minta: approvedQty,
      catatan: catatanUpdate
    })
    .eq('id', reqId);

  // 5. Catat Mutasi
  await supabase.from('stok_mutasi').insert([{
    barang_id: barang.id,
    tipe_mutasi: 'keluar',
    jumlah: approvedQty,
    keterangan: `Approval Permintaan #${reqId}`,
    user_id: request.user_id
  }]);

  await addLog(adminId, 'Approve Permintaan', `Menyetujui permintaan ${approvedQty} ${barang.nama_barang}`);
};

export const rejectPermintaan = async (reqId: number, adminId: number, reason: string) => {
  // Ambil catatan lama
  const { data: req } = await supabase.from('permintaan_atk').select('catatan').eq('id', reqId).single();
  const existingNote = req?.catatan || '-';
  const newNote = `[Ditolak: ${reason}] Catatan User: ${existingNote}`;

  const { error } = await supabase
    .from('permintaan_atk')
    .update({ 
      status: 'ditolak',
      catatan: newNote
    })
    .eq('id', reqId);

  if (error) throw new Error(error.message);
  await addLog(adminId, 'Tolak Permintaan', `Menolak permintaan #${reqId}. Alasan: ${reason}`);
};

// --- LOGGING & REPORT ---

export const getLogs = async (): Promise<LogAktivitas[]> => {
  const { data, error } = await supabase
    .from('log_aktivitas')
    .select(`
      *,
      users (nama)
    `)
    .order('created_at', { ascending: false });

  if (error) return [];
  
  return data.map((l: any) => ({
    ...l,
    user_nama: l.users?.nama || 'System'
  }));
};

const addLog = async (userId: number, aktivitas: string, detail: string) => {
  await supabase.from('log_aktivitas').insert([{
    user_id: userId,
    aktivitas,
    detail
  }]);
};

export const getMutasi = async (): Promise<(Mutasi & { barang_nama?: string, user_nama?: string })[]> => {
  const { data, error } = await supabase
    .from('stok_mutasi')
    .select(`
      *,
      barang_atk (nama_barang),
      users (nama)
    `)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map((m: any) => ({
    ...m,
    barang_nama: m.barang_atk?.nama_barang || 'Unknown Item',
    user_nama: m.users?.nama || 'Unknown User'
  }));
};