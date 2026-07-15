import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tab,
  Tabs,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import AppLayout from '../../layouts/AppLayout';
import { PageHeader } from '../../atoms/PageHeader';
import { PageTitle } from '../../atoms/PageTitle';
import { StyledSection } from '../../atoms/StyledSection';

import { customerService } from '../../services/customerService';
import UserService from '../../services/userService';
import { ref, onValue } from 'firebase/database';
import { db } from '../../db/firebase';

interface ReportKPI {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  sub?: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  // Filters state
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Load all customers (active + inactive)
  useEffect(() => {
    const unsub = customerService.subscribeCustomers({}, (data) => setCustomers(data || []));
    return () => unsub();
  }, []);

  // Load all users
  useEffect(() => {
    UserService.search({}).then(setUsers).catch(console.error);
  }, []);

  // Load attendance
  useEffect(() => {
    const attendanceRef = ref(db, 'attendance');
    const unsub = onValue(attendanceRef, (snapshot) => {
      if (!snapshot.exists()) { setAttendance([]); return; }
      const all = Object.entries(snapshot.val()).map(([key, val]: any) => ({ id: key, ...val }));
      setAttendance(all.sort((a, b) => (b.loginTime || 0) - (a.loginTime || 0)));
    });
    return () => unsub();
  }, []);

  // ─── KPIs ────────────────────────────────────────────────────────────────
  const customerKPIs = useMemo<ReportKPI[]>(() => {
    const active = customers.filter((c) => c.status === 'ACTIVE').length;
    const inactive = customers.filter((c) => c.status === 'INACTIVE').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.paidAmount) || 0), 0);
    const pendingBalance = customers.reduce((sum, c) => sum + (Number(c.balanceAmount) || 0), 0);
    const expiringIn30 = customers.filter((c) => {
      if (c.status !== 'ACTIVE' || !c.serviceEndDate) return false;
      const diff = c.serviceEndDate - Date.now();
      return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    }).length;
    return [
      { label: 'Active Customers', value: active, color: '#10b981', icon: <CheckCircleRoundedIcon />, sub: 'Currently serviced' },
      { label: 'Inactive Customers', value: inactive, color: '#ef4444', icon: <CancelRoundedIcon />, sub: 'Service ended' },
      { label: 'Revenue Collected', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#3b82f6', icon: <ReceiptLongRoundedIcon />, sub: 'Payments received' },
      { label: 'Outstanding Balance', value: `₹${pendingBalance.toLocaleString('en-IN')}`, color: '#f59e0b', icon: <TrendingDownRoundedIcon />, sub: 'Awaiting collection' },
      { label: 'Expiring Soon (30d)', value: expiringIn30, color: '#8b5cf6', icon: <AccessTimeRoundedIcon />, sub: 'Service contracts' },
    ];
  }, [customers]);

  const userKPIs = useMemo<ReportKPI[]>(() => {
    const active = users.filter((u) => u.status === 'ACTIVE').length;
    const inactive = users.filter((u) => u.status === 'INACTIVE').length;
    const totalSessions = attendance.length;
    const todaySessions = attendance.filter((a) => {
      const today = new Date().toISOString().split('T')[0];
      return a.date === today;
    }).length;
    return [
      { label: 'Active Employees', value: active, color: '#10b981', icon: <CheckCircleRoundedIcon />, sub: 'Current staff' },
      { label: 'Inactive Employees', value: inactive, color: '#ef4444', icon: <CancelRoundedIcon />, sub: 'Deactivated accounts' },
      { label: 'Total Login Sessions', value: totalSessions, color: '#3b82f6', icon: <AccessTimeRoundedIcon />, sub: 'All time attendance' },
      { label: "Today's Sessions", value: todaySessions, color: '#8b5cf6', icon: <PeopleRoundedIcon />, sub: new Date().toLocaleDateString('en-IN') },
    ];
  }, [users, attendance]);

  // ─── Filtered data ────────────────────────────────────────────────────────
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
      if (filterStartDate && c.serviceStartDate && c.serviceStartDate < new Date(filterStartDate).getTime()) return false;
      if (filterEndDate && c.serviceStartDate && c.serviceStartDate > new Date(filterEndDate).getTime()) return false;
      return true;
    });
  }, [customers, filterStatus, filterStartDate, filterEndDate]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterStatus !== 'ALL' && u.status !== filterStatus) return false;
      if (filterRole !== 'ALL' && u.roleId !== filterRole) return false;
      return true;
    });
  }, [users, filterStatus, filterRole]);

  // ─── CSV Export ───────────────────────────────────────────────────────────
  const exportCSV = (data: any[], filename: string, columns: { key: string; label: string }[]) => {
    const header = columns.map((c) => c.label).join(',');
    const rows = data.map((row) =>
      columns.map((col) => {
        const val = row[col.key];
        if (typeof val === 'number' && val > 1000000000000) {
          return `"${new Date(val).toLocaleDateString('en-IN')}"`;
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number | null | undefined) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // ─── KPI Card Component ───────────────────────────────────────────────────
  const KPICard = ({ kpi }: { kpi: ReportKPI }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px -8px rgba(0,0,0,0.12)' },
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: '12px',
          bgcolor: `${kpi.color}15`,
          color: kpi.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {kpi.icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {kpi.label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: kpi.color, lineHeight: 1.2 }}>
          {kpi.value}
        </Typography>
        {kpi.sub && (
          <Typography variant="caption" color="text.secondary">
            {kpi.sub}
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <AppLayout title="Reports — Training Trains CRM">
      <PageHeader>
        <PageTitle>Reports & Analytics</PageTitle>
        <Typography variant="body2" color="text.secondary">
          Lifecycle metrics, attendance logs, and service contract analysis
        </Typography>
      </PageHeader>

      <StyledSection>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: '1px solid var(--border)', mb: 3 }}
        >
          <Tab icon={<BusinessRoundedIcon />} iconPosition="start" label="Customer Reports" />
          <Tab icon={<PeopleRoundedIcon />} iconPosition="start" label="User & Attendance Reports" />
        </Tabs>

        {/* ─── TAB 0: Customer Reports ─────────────────────────────────────── */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* KPI Grid */}
            <Grid container spacing={2}>
              {customerKPIs.map((kpi, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                  <KPICard kpi={kpi} />
                </Grid>
              ))}
            </Grid>

            {/* Filters Row */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mr: 1 }}>Filters:</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Service Start (From)"
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  size="small"
                  label="Service Start (To)"
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 180 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setFilterStatus('ALL'); setFilterStartDate(''); setFilterEndDate(''); }}
                >
                  Clear
                </Button>
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadRoundedIcon />}
                    size="small"
                    onClick={() =>
                      exportCSV(filteredCustomers, 'customer_report', [
                        { key: 'customerId', label: 'Customer ID' },
                        { key: 'companyName', label: 'Company' },
                        { key: 'contactPerson', label: 'Contact Person' },
                        { key: 'mobile', label: 'Mobile' },
                        { key: 'status', label: 'Lifecycle Status' },
                        { key: 'totalAmount', label: 'Total Amount' },
                        { key: 'paidAmount', label: 'Paid Amount' },
                        { key: 'balanceAmount', label: 'Balance' },
                        { key: 'paymentStatus', label: 'Payment Status' },
                        { key: 'serviceStartDate', label: 'Service Start' },
                        { key: 'serviceEndDate', label: 'Service End' },
                        { key: 'deactivatedBy', label: 'Deactivated By' },
                        { key: 'deactivationReason', label: 'Deactivation Reason' },
                      ])
                    }
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Customer Table */}
            <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Customer Lifecycle Report ({filteredCustomers.length} records)
                </Typography>
              </Box>
              <Divider />
              <TableContainer sx={{ maxHeight: 480 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Customer ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Lifecycle</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Balance</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Service Start</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Service End</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No records found matching the filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{customer.customerId || '—'}</TableCell>
                          <TableCell>{customer.companyName || '—'}</TableCell>
                          <TableCell>{customer.contactPerson || '—'}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={customer.status || 'ACTIVE'}
                              color={customer.status === 'ACTIVE' ? 'success' : 'error'}
                              variant={customer.status === 'ACTIVE' ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={(customer.paymentStatus || 'unpaid').toUpperCase()}
                              color={
                                customer.paymentStatus === 'paid' ? 'success'
                                  : customer.paymentStatus === 'partial' ? 'warning'
                                    : 'error'
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: Number(customer.balanceAmount) > 0 ? 'error.main' : 'success.main' }}>
                            ₹{(Number(customer.balanceAmount) || 0).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>{formatDate(customer.serviceStartDate)}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>
                            {customer.status === 'INACTIVE' ? formatDate(customer.serviceEndDate) : (
                              <Chip size="small" label="Active" color="success" variant="outlined" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* ─── TAB 1: User & Attendance Reports ────────────────────────────── */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* KPI Grid */}
            <Grid container spacing={2}>
              {userKPIs.map((kpi, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <KPICard kpi={kpi} />
                </Grid>
              ))}
            </Grid>

            {/* Filters Row */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mr: 1 }}>Filters:</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Role</InputLabel>
                  <Select value={filterRole} label="Role" onChange={(e) => setFilterRole(e.target.value)}>
                    <MenuItem value="ALL">All Roles</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setFilterStatus('ALL'); setFilterRole('ALL'); }}
                >
                  Clear
                </Button>
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadRoundedIcon />}
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      exportCSV(filteredUsers, 'user_report', [
                        { key: 'employeeId', label: 'Employee ID' },
                        { key: 'firstName', label: 'First Name' },
                        { key: 'lastName', label: 'Last Name' },
                        { key: 'userName', label: 'Username' },
                        { key: 'mobile', label: 'Mobile' },
                        { key: 'roleId', label: 'Role' },
                        { key: 'status', label: 'Status' },
                        { key: 'serviceStartDate', label: 'Service Start' },
                        { key: 'serviceEndDate', label: 'Service End' },
                        { key: 'deactivatedBy', label: 'Deactivated By' },
                        { key: 'deactivationReason', label: 'Deactivation Reason' },
                      ])
                    }
                  >
                    Export Users CSV
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadRoundedIcon />}
                    size="small"
                    onClick={() =>
                      exportCSV(attendance, 'attendance_report', [
                        { key: 'employeeId', label: 'Employee ID' },
                        { key: 'userName', label: 'Username' },
                        { key: 'firstName', label: 'Name' },
                        { key: 'date', label: 'Date' },
                        { key: 'loginTime', label: 'Login Time' },
                        { key: 'logoutTime', label: 'Logout Time' },
                        { key: 'duration', label: 'Duration' },
                        { key: 'status', label: 'Status' },
                      ])
                    }
                  >
                    Export Attendance CSV
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Users Table */}
            <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Employee Lifecycle Report ({filteredUsers.length} records)
                </Typography>
              </Box>
              <Divider />
              <TableContainer sx={{ maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Service Start</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Service End</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id} hover>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{u.employeeId}</TableCell>
                          <TableCell>{`${u.firstName} ${u.lastName || ''}`.trim()}</TableCell>
                          <TableCell>@{u.userName}</TableCell>
                          <TableCell>
                            <Chip size="small" label={u.roleId?.toUpperCase()} variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={u.status || 'ACTIVE'}
                              color={u.status === 'ACTIVE' ? 'success' : 'error'}
                              variant={u.status === 'ACTIVE' ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>{formatDate(u.serviceStartDate)}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>
                            {u.status === 'INACTIVE' ? formatDate(u.serviceEndDate) : (
                              <Chip size="small" label="Active" color="success" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.deactivationReason || '—'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Attendance Log */}
            <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Attendance Log ({attendance.length} sessions)
                </Typography>
              </Box>
              <Divider />
              <TableContainer sx={{ maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Login</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Logout</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No attendance records yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendance.map((record) => (
                        <TableRow key={record.id} hover>
                          <TableCell>{record.employeeId || '—'}</TableCell>
                          <TableCell>{record.firstName || '—'}</TableCell>
                          <TableCell>@{record.userName || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>{record.date || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>{formatTime(record.loginTime)}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem' }}>
                            {record.logoutTime ? formatTime(record.logoutTime) : (
                              <Chip label="Active Session" size="small" color="success" />
                            )}
                          </TableCell>
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
          </Box>
        )}
      </StyledSection>
    </AppLayout>
  );
}
