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
import StatsSection, { type StatItem } from '../../layouts/StatsSection';
import { customerService } from '../../services/customerService';

import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = customerService.subscribeCustomers({}, (data) => {
      setCustomers(data || []);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute Statistics
  const statsItems = useMemo<StatItem[]>(() => {
    const totalCount = customers.length;

    // Active status: approved, development, negotiation, requirement, proposal
    const activeCount = customers.filter(
      (c) => c.status && !['rejected', 'onhold', 'all'].includes(String(c.status).toLowerCase())
    ).length;

    const totalValue = customers.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0);
    const totalOutstanding = customers.reduce((sum, c) => sum + (Number(c.balanceAmount) || 0), 0);

    return [
      {
        label: 'Total Customers',
        value: totalCount,
        icon: <PeopleRoundedIcon color="primary" sx={{ fontSize: 32 }} />,
      },
      {
        label: 'Active Projects',
        value: activeCount,
        icon: <AssignmentRoundedIcon color="success" sx={{ fontSize: 32 }} />,
      },
      {
        label: 'Total Contract Value',
        value: `₹${totalValue.toLocaleString('en-IN')}`,
        icon: <MonetizationOnRoundedIcon color="warning" sx={{ fontSize: 32 }} />,
      },
      {
        label: 'Outstanding Balance',
        value: `₹${totalOutstanding.toLocaleString('en-IN')}`,
        icon: <AccountBalanceWalletRoundedIcon color="error" sx={{ fontSize: 32 }} />,
      },
    ];
  }, [customers]);

  // Project Status Breakdown
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
      const statusKey = String(c.status || '').toLowerCase();
      if (statusKey in counts) {
        counts[statusKey]++;
      }
    });

    return [
      { label: 'New Lead', count: counts.new, color: 'info' },
      { label: 'Requirements', count: counts.requirement, color: 'secondary' },
      { label: 'Proposal Sent', count: counts.proposal, color: 'warning' },
      { label: 'Negotiation', count: counts.negotiation, color: 'warning' },
      { label: 'Approved', count: counts.approved, color: 'success' },
      { label: 'Development', count: counts.development, color: 'success' },
      { label: 'On Hold', count: counts.onhold, color: 'default' },
      { label: 'Rejected', count: counts.rejected, color: 'error' },
    ];
  }, [customers]);

  // Recent 5 Customers
  const recentCustomers = useMemo(() => {
    return [...customers].slice(0, 5);
  }, [customers]);

  // Status helper mapping to user-friendly label and color
  const getStatusChip = (status: string) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'new':
        return <Chip size="small" label="New" color="info" variant="outlined" />;
      case 'requirement':
        return <Chip size="small" label="Requirements" color="secondary" variant="outlined" />;
      case 'proposal':
        return <Chip size="small" label="Proposal Sent" color="warning" variant="outlined" />;
      case 'negotiation':
        return <Chip size="small" label="Negotiation" color="warning" variant="outlined" />;
      case 'approved':
        return <Chip size="small" label="Approved" color="success" />;
      case 'development':
        return <Chip size="small" label="Development" color="success" />;
      case 'onhold':
        return <Chip size="small" label="On Hold" color="default" />;
      case 'rejected':
        return <Chip size="small" label="Rejected" color="error" />;
      default:
        return <Chip size="small" label={status || 'Unknown'} variant="outlined" />;
    }
  };

  return (
    <AppLayout title="Training Trains CRM">
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Real-time insights for Training Trains
        </Typography>
      </PageHeader>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, px: 1 }}>
        {/* Dynamic Statistics cards */}
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>Loading statistics...</Box>
        ) : (
          <StatsSection items={statsItems} />
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
                  Recent Customers & Enquiries
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate('/crm')}
                >
                  View All
                </Button>
              </Box>

              <TableContainer sx={{ flex: 1, minHeight: 250 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Client ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Company Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact Person</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Total Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          Loading recent entries...
                        </TableCell>
                      </TableRow>
                    ) : recentCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ py: 4, color: 'text.secondary' }}
                        >
                          No customer records found.
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
                Enquiry Status Summary
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
