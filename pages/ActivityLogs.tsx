import React, { useEffect, useState } from 'react';
import { LogAktivitas } from '../types';
import * as api from '../services/mockBackend';

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogAktivitas[]>([]);

  useEffect(() => {
    api.getLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas System</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ul className="space-y-4">
          {logs.map((log) => (
            <li key={log.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-12 text-xs text-gray-400 pt-1">
                {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="text-blue-600">{log.user_nama}</span> melakukan <span className="font-bold">{log.aktivitas}</span>
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{log.detail}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
          {logs.length === 0 && <p className="text-gray-500 text-center">Belum ada aktivitas.</p>}
        </ul>
      </div>
    </div>
  );
};