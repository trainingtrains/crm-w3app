import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Alert,
} from '@mui/material';

import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

import AppLayout from '../../layouts/AppLayout';
import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { CONSTANTS } from '../../constants';

import UserService, { type UserDetailsResponse } from '../../services/userService';
import { timelineService, type TimelineEvent } from '../../services/timelineService';
import { useNotification } from '../../context/NotificationContext';
import { usePermission } from '../../auth/usePermission';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../../db/firebase';

interface AttendanceRecord {
  id: string;
  date: string;
  loginTime: number;
  logoutTime: number | null;
  duration: string;
  status: string;
  employeeId: string;
}

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { hasPermission } = usePermission();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<UserDetailsResponse | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [assignedCustomersCount, setAssignedCustomersCount] = useState(0);

  // Deactivation dialog state
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUser = useCallback(async () => {
    if (!id) return;
    try {
      const response = await UserService.getById(id);
      setUser(response);
    } catch (error: any) {
      showError(error.message || 'Unable to load user.');
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Load timeline events
  useEffect(() => {
    if (!id) return;
    timelineService.getEvents(id).then(setTimeline);
  }, [id]);

  // Subscribe to attendance records for this user
  useEffect(() => {
    if (!id) return;
    const attendanceRef = ref(db, 'attendance');
    const unsubscribe = onValue(attendanceRef, (snapshot) => {
      if (!snapshot.exists()) {
        setAttendance([]);
        return;
      }
      const all = Object.entries(snapshot.val()).map(([key, val]: any) => ({ id: key, ...val }));
      const userAttendance = all
        .filter((a: any) => a.userId === id)
        .sort((a: any, b: any) => (b.loginTime || 0) - (a.loginTime || 0));
      setAttendance(userAttendance);
    });
    return () => unsubscribe();
  }, [id]);

  // Count open tickets assigned to this user
  useEffect(() => {
    if (!user) return;
    const ticketsRef = ref(db, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (!snapshot.exists()) { setOpenTicketsCount(0); return; }
      const all = Object.values(snapshot.val()) as any[];
      const open = all.filter(
        (t) => t.assignedTo === user.userName && t.status !== 'completed'
      ).length;
      setOpenTicketsCount(open);
    });
    return () => unsubscribe();
  }, [user]);

  // Count customers assigned to this user
  useEffect(() => {
    if (!user) return;
    const customersRef = ref(db, 'customers');
    const unsubscribe = onValue(customersRef, (snapshot) => {
      if (!snapshot.exists()) { setAssignedCustomersCount(0); return; }
      const all = Object.values(snapshot.val()) as any[];
      const assigned = all.filter(
        (c) => c.assignedEmployee === user.userName && c.status === 'ACTIVE'
      ).length;
      setAssignedCustomersCount(assigned);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDeactivate = useCallback(async () => {
    if (!id || !deactivationReason.trim()) return;
    setIsSubmitting(true);
    try {
      await UserService.delete(id, authUser?.username || 'System', deactivationReason.trim());
      showSuccess('User deactivated successfully.');
      setIsDeactivateOpen(false);
      setDeactivationReason('');
      await loadUser();
    } catch (error: any) {
      showError(error.message || 'Unable to deactivate user.');
    } finally {
      setIsSubmitting(false);
    }
  }, [id, deactivationReason, authUser, loadUser, showSuccess, showError]);

  const handleActivate = useCallback(async () => {
    if (!id) return;
    try {
      await UserService.activate(id);
      showSuccess('User activated successfully.');
      await loadUser();
    } catch (error: any) {
      showError(error.message || 'Unable to activate user.');
    }
  }, [id, loadUser, showSuccess, showError]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/nedituser/${id}`);
  }, [id, navigate]);

  if (!user) {
    return null;
  }

  const isActive = user.status === 'ACTIVE';

  const formatDate = (ts: number | null) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimelineIcon = (title: string) => {
    if (title.includes('Deactivat')) return '🔴';
    if (title.includes('Activat') || title.includes('Created')) return '🟢';
    if (title.includes('Role') || title.includes('Updated')) return '🔵';
    if (title.includes('Login') || title.includes('Logout')) return '⚪';
    return '🔘';
  };

  return (
    <AppLayout>
      <StyledSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <PageTitle>{CONSTANTS.LBL_USER_DETAILS}</PageTitle>
          <Stack direction="row" spacing={1}>
            {hasPermission('USER_EDIT') && (
              <Button
                variant="outlined"
                startIcon={<EditRoundedIcon />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
            {hasPermission('USER_DELETE') && isActive && (
              <Button
                variant="contained"
                color="error"
                startIcon={<PersonOffRoundedIcon />}
                onClick={() => setIsDeactivateOpen(true)}
              >
                Deactivate
              </Button>
            )}
            {hasPermission('USER_DELETE') && !isActive && (
              <Button
                variant="contained"
                color="success"
                startIcon={<PersonAddAlt1RoundedIcon />}
                onClick={handleActivate}
              >
                Reactivate
              </Button>
            )}
          </Stack>
        </Box>

        {/* Status Banner */}
        {!isActive && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>This user is INACTIVE.</strong> Deactivated by {user.deactivatedBy || '—'} on{' '}
            {formatDate(user.serviceEndDate)}. Reason: {user.deactivationReason || '—'}
          </Alert>
        )}

        {/* User Info Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.firstName} {user.lastName || ''}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                @{user.userName} · {user.employeeId}
              </Typography>
            </Box>
            <Chip
              label={isActive ? 'ACTIVE' : 'INACTIVE'}
              color={isActive ? 'success' : 'error'}
              variant="filled"
              size="medium"
              sx={{ fontWeight: 700, fontSize: '0.8rem', px: 1 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {[
              { label: 'Role', value: user.roleId?.toUpperCase() || '—' },
              { label: 'Email', value: user.email || '—' },
              { label: 'Mobile', value: user.mobile || '—' },
              { label: 'Service Start', value: formatDate(user.serviceStartDate) },
              { label: 'Service End', value: isActive ? 'Active' : formatDate(user.serviceEndDate) },
              { label: 'Open Tickets', value: openTicketsCount },
              { label: 'Assigned Customers', value: assignedCustomersCount },
              { label: 'Attendance Sessions', value: attendance.length },
            ].map((item) => (
              <Box key={item.label}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.25 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: '1px solid var(--border)', mb: 2 }}
        >
          <Tab icon={<AccessTimeRoundedIcon />} iconPosition="start" label="Attendance History" />
          <Tab icon={<TimelineRoundedIcon />} iconPosition="start" label="Service Timeline" />
        </Tabs>

        {/* Tab 0: Attendance */}
        {activeTab === 0 && (
          <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'var(--surface-alt, #f5f7fb)' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Login Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Logout Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.date || formatDate(record.loginTime)}</TableCell>
                        <TableCell>{formatTime(record.loginTime)}</TableCell>
                        <TableCell>{record.logoutTime ? formatTime(record.logoutTime) : <Chip label="Active" size="small" color="success" />}</TableCell>
                        <TableCell>{record.duration || '—'}</TableCell>
                        <TableCell>
                          <Chip label={record.status || 'Present'} size="small" color="primary" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Tab 1: Service Timeline */}
        {activeTab === 1 && (
          <Box sx={{ position: 'relative', pl: 4 }}>
            {/* Vertical line */}
            <Box
              sx={{
                position: 'absolute',
                left: 15,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: 'var(--border)',
                borderRadius: 1,
              }}
            />
            {timeline.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No timeline events recorded.
              </Typography>
            ) : (
              timeline.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    position: 'relative',
                    mb: 3,
                    '&::before': {
                      content: `"${getTimelineIcon(event.title)}"`,
                      position: 'absolute',
                      left: -26,
                      top: 2,
                      fontSize: '14px',
                    },
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm, 8px)',
                      backgroundColor: 'var(--surface)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                    {event.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {event.description}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))
            )}
          </Box>
        )}
      </StyledSection>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={isDeactivateOpen} onClose={() => setIsDeactivateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
          ⚠️ Deactivate User
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to deactivate <strong>{user.firstName} {user.lastName || ''}</strong>. This will suspend their access.
            No data will be deleted.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Open Tickets</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{openTicketsCount}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Assigned Customers</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{assignedCustomersCount}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Attendance Records</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{attendance.length}</Typography>
            </Box>
          </Box>

          <TextField
            label="Reason for Deactivation *"
            multiline
            rows={3}
            fullWidth
            value={deactivationReason}
            onChange={(e) => setDeactivationReason(e.target.value)}
            placeholder="Enter reason (e.g., Resigned, Contract ended, Policy violation)"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDeactivateOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeactivate}
            disabled={isSubmitting || !deactivationReason.trim()}
          >
            {isSubmitting ? 'Deactivating...' : 'Confirm Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default UserDetailsPage;
