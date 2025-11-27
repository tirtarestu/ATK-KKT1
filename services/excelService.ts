import ExcelJS from 'exceljs';
import * as api from './mockBackend';

// --- Shared Helper for Styling ---
const downloadWorkbook = async (workbook: ExcelJS.Workbook, fileName: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const setupWorksheet = (worksheet: ExcelJS.Worksheet, title: string, headers: string[]) => {
  // 1. Title Row
  worksheet.mergeCells('A1', String.fromCharCode(65 + headers.length - 1) + '1');
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = title.toUpperCase();
  titleRow.getCell(1).font = { size: 16, bold: true, name: 'Arial' };
  titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  titleRow.height = 30;

  // 2. Spacer Row
  worksheet.addRow([]);

  // 3. Header Row
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' } // Blue header
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
};

const styleDataRows = (worksheet: ExcelJS.Worksheet) => {
  // Auto-width columns and borders for data
  worksheet.columns.forEach(column => {
    column.width = 20; // Default width
    // Simple auto-fit logic approximation
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
      // Add borders to all cells
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    column.width = maxLength < 10 ? 10 : (maxLength > 50 ? 50 : maxLength + 2);
  });
};

// --- 1. Laporan Inventaris Barang ---
export const exportInventaris = async () => {
  const data = await api.getBarang();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventaris');
  
  const headers = ['Kode Barang', 'Nama Barang', 'Kategori', 'Stok', 'Satuan', 'Lokasi Simpan', 'Terakhir Diperbarui'];
  setupWorksheet(worksheet, 'Laporan Inventaris ATK', headers);

  data.forEach(item => {
    worksheet.addRow([
      item.kode_barang,
      item.nama_barang,
      item.kategori,
      item.stok,
      item.satuan,
      item.lokasi_simpan,
      new Date(item.updated_at).toLocaleString('id-ID')
    ]);
  });

  styleDataRows(worksheet);
  await downloadWorkbook(workbook, 'Laporan_Inventaris');
};

// --- 2. Laporan Mutasi Stok ---
export const exportMutasi = async () => {
  const data = await api.getMutasi();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Mutasi Stok');

  const headers = ['ID', 'Tanggal', 'Nama Barang', 'Tipe Mutasi', 'Jumlah', 'Keterangan', 'Oleh User'];
  setupWorksheet(worksheet, 'Laporan Mutasi Stok', headers);

  data.forEach(m => {
    worksheet.addRow([
      m.id,
      new Date(m.created_at).toLocaleString('id-ID'),
      m.barang_nama,
      m.tipe_mutasi.toUpperCase(),
      m.jumlah,
      m.keterangan,
      m.user_nama
    ]);
  });

  styleDataRows(worksheet);
  await downloadWorkbook(workbook, 'Laporan_Mutasi');
};

// --- 3. Laporan Permintaan ATK ---
export const exportPermintaan = async () => {
  const data = await api.getPermintaan();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Permintaan');

  const headers = ['ID', 'Tanggal Permintaan', 'Nama User', 'Nama Barang', 'Jumlah', 'Status', 'Catatan'];
  setupWorksheet(worksheet, 'Laporan Permintaan ATK', headers);

  data.forEach(r => {
    worksheet.addRow([
      r.id,
      new Date(r.created_at).toLocaleString('id-ID'),
      r.user_nama,
      r.barang_nama,
      r.jumlah_minta,
      r.status.toUpperCase(),
      r.catatan
    ]);
  });

  styleDataRows(worksheet);
  await downloadWorkbook(workbook, 'Laporan_Permintaan');
};
