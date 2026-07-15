import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ref, push, get, update } from 'firebase/database';
import { db } from '../db/firebase';
import UserService from '../services/userService';
import { auditService } from '../services/auditService';
import { runMigration } from '../db/migrate';

export interface AuthUser {
  id: string;
  username: string;
  name?: string;
  role?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'auth_user';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Trigger migration scan on application initialization
  useEffect(() => {
    runMigration().catch((err) => console.error('Migration failed:', err));
  }, []);

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);

    if (value) {
      setUser(JSON.parse(value));
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await UserService.login(data.username, data.password);

    // First-time setup
    if (response.adminCreated) {
      alert(response.message);
      return;
    }

    if (!response.user) {
      throw new Error('Login failed.');
    }

    const authUser: AuthUser = {
      id: response.user.id,
      username: response.user.userName || (response.user as any).username || '',
      name: response.user.firstName || (response.user as any).name || '',
      role: (response.user.roleId || (response.user as any).role || '').toUpperCase(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);

    // Track login event audit log
    await auditService.logEvent(authUser.username, authUser.role ?? '', 'User Logged In', 'AUTH');

    // Attendance Log Entry
    try {
      const now = Date.now();
      const dateStr = new Date().toISOString().split('T')[0];
      const attendanceRef = ref(db, 'attendance');
      const recordRef = await push(attendanceRef, {
        userId: authUser.id,
        employeeId: response.user.employeeId || 'EMP',
        userName: authUser.username,
        firstName: authUser.name || '',
        date: dateStr,
        loginTime: now,
        logoutTime: null,
        duration: '',
        status: 'Present',
      });
      if (recordRef.key) {
        localStorage.setItem('attendance_record_id', recordRef.key);
      }
    } catch (err) {
      console.error('Failed to log login attendance:', err);
    }
  }, []);

  const logout = useCallback(() => {
    if (user) {
      auditService.logEvent(user.username, user.role ?? '', 'User Logged Out', 'AUTH');
      
      // Update logout attendance record
      const attendanceRecordId = localStorage.getItem('attendance_record_id');
      if (attendanceRecordId) {
        const attendanceRef = ref(db, `attendance/${attendanceRecordId}`);
        const now = Date.now();
        get(attendanceRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const loginTime = snapshot.val().loginTime;
              const durationMs = now - loginTime;
              const hours = Math.floor(durationMs / 3600000);
              const minutes = Math.floor((durationMs % 3600000) / 60000);
              const durationStr = `${hours}h ${minutes}m`;
              update(attendanceRef, {
                logoutTime: now,
                duration: durationStr,
              });
            }
          })
          .catch((err) => console.error('Failed to update logout attendance:', err));
        localStorage.removeItem('attendance_record_id');
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
