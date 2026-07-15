import { ref, push } from 'firebase/database';
import { db } from '../db/firebase';

export interface AuditLog {
  user: string;
  role: string;
  action: string;
  timestamp: number;
  module: string;
  ip: string;
}

let cachedIp = '127.0.0.1';
// Try fetching public IP, fallback to standard localhost
fetch('https://api.ipify.org?format=json')
  .then((res) => res.json())
  .then((data) => {
    if (data && data.ip) {
      cachedIp = data.ip;
    }
  })
  .catch(() => {
    // Silently fallback on offline/sandbox environments
  });

export const auditService = {
  async logEvent(user: string, role: string, action: string, module: string) {
    try {
      const logsRef = ref(db, 'audit_logs');
      const newLog: AuditLog = {
        user: user || 'Anonymous',
        role: role || 'GUEST',
        action,
        timestamp: Date.now(),
        module,
        ip: cachedIp,
      };
      await push(logsRef, newLog);
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  },
};
