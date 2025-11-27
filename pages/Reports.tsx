import React from 'react';
import { Download, FileSpreadsheet, Layers, Archive } from 'lucide-react';
import * as excelService from '../services/excelService';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Laporan & Export Data</h1>
        <p className="text-gray-500">Unduh data sistem dalam format Excel untuk pelaporan dan arsip.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Inventaris */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Archive size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Laporan Inventaris</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Data lengkap semua barang ATK, termasuk stok saat ini, kategori, dan lokasi penyimpanan.
          </p>
          <button 
            onClick={() => excelService.exportInventaris()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>

        {/* Card 2: Mutasi */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <Layers size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Laporan Mutasi Stok</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Riwayat keluar-masuk barang, termasuk penambahan barang baru dan pengurangan stok otomatis.
          </p>
          <button 
             onClick={() => excelService.exportMutasi()}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>

        {/* Card 3: Permintaan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <FileSpreadsheet size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Laporan Permintaan</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Rekap seluruh permintaan barang dari user, beserta status persetujuan dan catatan.
          </p>
          <button 
             onClick={() => excelService.exportPermintaan()}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>
      </div>
    </div>
  );
};