import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';

import AppLayout from '../../layouts/AppLayout';
import { PageHeader } from '../../atoms/PageHeader';
import { PageTitle } from '../../atoms/PageTitle';
import { customerService } from '../../services/customerService';
import UserService from '../../services/userService';

import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { useLanguage } from '../../context/LanguageContext';

export interface DashboardStatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Active customers for the recent list
    const unsubscribeCustomers = customerService.subscribeCustomers(
      { status: 'ACTIVE' },
      (data) => {
        setCustomers(data || []);
        setLoading(false);
      }
    );
    // All customers (active + inactive) for lifecycle KPIs
    const unsubscribeAll = customerService.subscribeCustomers({}, (data) => {
      setAllCustomers(data || []);
    });

    const unsubscribeTickets = customerService.subscribeAllTickets((data) => {
      setTickets(data || []);
    });

    UserService.search({})
      .then((res) => setAllUsers(res || []))
      .catch((err) => console.error('Error fetching users:', err));

    return () => {
      unsubscribeCustomers();
      unsubscribeAll();
      unsubscribeTickets();
    };
  }, []);

  // Compute 8 Statistics Widgets
  const statsItems = useMemo<DashboardStatItem[]>(() => {
    const activeCustomers = allCustomers.filter((c) => c.status === 'ACTIVE').length;
    const inactiveCustomers = allCustomers.filter((c) => c.status === 'INACTIVE').length;
    const openTickets = tickets.filter((t) => t.status !== 'completed').length;

    const totalRevenue = customers.reduce(
      (sum, c) => sum + ((Number(c.totalAmount) || 0) - (Number(c.balanceAmount) || 0)),
      0
    );
    const pendingPayments = customers.reduce((sum, c) => sum + (Number(c.balanceAmount) || 0), 0);
    const activeUserCount = allUsers.filter((u) => u.status === 'ACTIVE').length;
    const inactiveUserCount = allUsers.filter((u) => u.status === 'INACTIVE').length;

    const resolvedCount = tickets.filter((t) => t.status === 'completed').length;
    const resolutionRate =
      tickets.length > 0 ? `${Math.round((resolvedCount / tickets.length) * 100)}%` : '100%';

    return [
      {
        label: 'Active Customers',
        value: activeCustomers,
        trend: `${inactiveCustomers} inactive`,
        icon: <BusinessRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#10b981',
      },
      {
        label: 'Inactive Customers',
        value: inactiveCustomers,
        trend: 'Service ended',
        icon: <CancelRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#ef4444',
      },
      {
        label: 'Active Users',
        value: activeUserCount,
        trend: `${inactiveUserCount} inactive`,
        icon: <GroupAddRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#3b82f6',
      },
      {
        label: 'Inactive Users',
        value: inactiveUserCount,
        trend: 'Deactivated accounts',
        icon: <PersonOffRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#8b5cf6',
      },
      {
        label: t('openTickets', 'Open Tickets'),
        value: openTickets,
        trend: `${tickets.filter((t) => t.status === 'not_started').length} new complaints`,
        icon: <ConfirmationNumberRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#f59e0b',
      },
      {
        label: t('revenue', 'Revenue'),
        value: `₹${totalRevenue.toLocaleString('en-IN')}`,
        trend: 'Collected payments',
        icon: <MonetizationOnRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#06b6d4',
      },
      {
        label: t('pendingPayments', 'Pending Payments'),
        value: `₹${pendingPayments.toLocaleString('en-IN')}`,
        trend: 'Awaiting collections',
        icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#ec4899',
      },
      {
        label: t('ticketResolutionRate', 'Resolution Rate'),
        value: resolutionRate,
        trend: 'Resolved complaints',
        icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 24 }} />,
        color: '#8b5cf6',
      },
    ];
  }, [allCustomers, customers, tickets, allUsers, t]);

  // Project Status Breakdown — reads `projectStatus` (pipeline) not lifecycle `status`
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      requirement: 0,
      proposal: 0,
      negotiation: 0,
      approved: 0,
      development: 0,
      onhold: 0,
      rejected: 0,
    };

    customers.forEach((c) => {
      // Prefer a dedicated pipeline/project status field over the lifecycle `status` field
      const statusKey = String(c.projectStatus || c.pipelineStatus || '').toLowerCase();
      if (statusKey in counts) {
        counts[statusKey]++;
      }
    });

    return [
      { label: t('newLead', 'New Lead'), count: counts.new, color: 'info' },
      { label: t('requirements', 'Requirements'), count: counts.requirement, color: 'secondary' },
      { label: t('proposalSent', 'Proposal Sent'), count: counts.proposal, color: 'warning' },
      { label: t('negotiation', 'Negotiation'), count: counts.negotiation, color: 'warning' },
      { label: t('statusApproved', 'Approved'), count: counts.approved, color: 'success' },
      { label: t('statusDevelopment', 'Development'), count: counts.development, color: 'success' },
      { label: t('statusOnHold', 'On Hold'), count: counts.onhold, color: 'default' },
      { label: t('statusRejected', 'Rejected'), count: counts.rejected, color: 'error' },
    ];
  }, [customers, t]);

  // Recent 5 Customers
  const recentCustomers = useMemo(() => {
    return [...customers].slice(0, 5);
  }, [customers]);

  // Status helper mapping to user-friendly label and color
  const getStatusChip = (status: string) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'new':
        return <Chip size="small" label={t('newLead', 'New')} color="info" variant="outlined" />;
      case 'requirement':
        return (
          <Chip
            size="small"
            label={t('requirements', 'Requirements')}
            color="secondary"
            variant="outlined"
          />
        );
      case 'proposal':
        return (
          <Chip
            size="small"
            label={t('proposalSent', 'Proposal Sent')}
            color="warning"
            variant="outlined"
          />
        );
      case 'negotiation':
        return (
          <Chip
            size="small"
            label={t('negotiation', 'Negotiation')}
            color="warning"
            variant="outlined"
          />
        );
      case 'approved':
        return <Chip size="small" label={t('statusApproved', 'Approved')} color="success" />;
      case 'development':
        return <Chip size="small" label={t('statusDevelopment', 'Development')} color="success" />;
      case 'onhold':
        return <Chip size="small" label={t('statusOnHold', 'On Hold')} color="default" />;
      case 'rejected':
        return <Chip size="small" label={t('statusRejected', 'Rejected')} color="error" />;
      default:
        return <Chip size="small" label={status || 'Unknown'} variant="outlined" />;
    }
  };

  return (
    <AppLayout title="Training Trains CRM">
      <PageHeader>
        <PageTitle>{t('dashboard')}</PageTitle>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Real-time insights for Training Trains
        </Typography>
      </PageHeader>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, px: 1 }}>
        {/* Dynamic Statistics cards */}
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>{t('loading')}</Box>
        ) : (
          <Grid container spacing={2}>
            {statsItems.map((stat, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--surface) 0%, rgba(255,255,255,0.7) 100%)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mt: 0.5, color: 'text.primary' }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.trend && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'success.main', fontWeight: 600, display: 'block', mt: 0.5 }}
                      >
                        {stat.trend}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <Grid container spacing={3}>
          {/* Recent Customers List */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('recentCustomers')}
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate('/crm')}
                >
                  {t('viewAll', 'View All')}
                </Button>
              </Box>

              <TableContainer sx={{ flex: 1, minHeight: 250 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>{t('customerId')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('companyName')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('contactPerson')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('projectStatus')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        {t('totalContractValue')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          {t('loading')}
                        </TableCell>
                      </TableRow>
                    ) : recentCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ py: 4, color: 'text.secondary' }}
                        >
                          {t('noCustomersFound', 'No customer records found.')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentCustomers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          hover
                          onClick={() => navigate(`/custDetails/${customer.id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {customer.customerId || '-'}
                          </TableCell>
                          <TableCell>{customer.companyName || '-'}</TableCell>
                          <TableCell>{customer.contactPerson || '-'}</TableCell>
                          <TableCell>{getStatusChip(customer.status)}</TableCell>
                          <TableCell align="right">
                            ₹{(customer.totalAmount ?? 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Project Status Breakdown Card */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('enquirySummary')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                {statusCounts.map((status) => (
                  <Box
                    key={status.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      border: '1px solid #f0f0f0',
                      backgroundColor: '#fcfcfc',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {status.label}
                    </Typography>
                    <Chip
                      size="small"
                      label={status.count}
                      color={status.color as any}
                      sx={{ fontWeight: 'bold', minWidth: 28 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}
