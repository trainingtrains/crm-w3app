import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Chip,
  Paper,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import AppLayout from '../../layouts/AppLayout';
import { PageHeader } from '../../atoms/PageHeader';
import { PageTitle } from '../../atoms/PageTitle';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import CustomForm, { type FormValues } from '../../layouts/CustomForm';
import { customerService } from '../../services/customerService';
import UserService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ReusableDataGrid from '../../layouts/ReusableDataGrid';
import type { FormField } from '../../layouts/types/form';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../auth/usePermission';

export default function TicketsPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const { showSuccess, showError } = useNotification();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState(0);
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Load raw data
  useEffect(() => {
    const unsubTickets = customerService.subscribeAllTickets((data) => {
      setTickets(data || []);
    });

    const unsubCusts = customerService.subscribeCustomers({}, (data) => {
      setCustomers(data || []);
    });

    UserService.search({})
      .then((list) => {
        setUsers(list || []);
      })
      .catch(console.error);

    return () => {
      unsubTickets();
      unsubCusts();
    };
  }, []);

  const loggedInUsername = user?.username ?? '';

  // Filtered tickets
  const myTickets = useMemo(() => {
    return tickets.filter((t) => t.assignedTo === loggedInUsername);
  }, [tickets, loggedInUsername]);

  const displayedTickets = useMemo(() => {
    return activeTab === 0 ? myTickets : tickets;
  }, [activeTab, myTickets, tickets]);

  const customerOptions = useMemo(() => {
    return customers.map((c) => ({
      label: c.companyName || c.contactPerson,
      value: c.id,
    }));
  }, [customers]);

  const userOptions = useMemo(() => {
    return users.map((u) => ({
      label: `${u.firstName} ${u.lastName || ''} (@${u.userName})`.trim(),
      value: u.userName,
    }));
  }, [users]);

  const hasEditAccess = useMemo(() => {
    if (!selectedTicket || !user) return false;
    return (
      user.role === 'ADMIN' ||
      user.role === 'MANAGER' ||
      user.username === selectedTicket.assignedTo
    );
  }, [selectedTicket, user]);

  const updateDefaultValues = useMemo(() => {
    if (!selectedTicket) return {};
    return {
      actionType: selectedTicket.status || 'not_started',
      newAssignee: selectedTicket.assignedTo || '',
      priority: selectedTicket.priority || 'medium',
      dueDate: selectedTicket.dueDate || '',
      comment: '',
    };
  }, [selectedTicket]);

  // Form Configurations
  // Form Configurations
  const createFormConfig = useMemo<FormField[]>(
    () => [
      {
        type: 'select',
        name: 'customerId',
        label: 'Customer / Company',
        rules: { required: 'Customer is required' },
        options: customerOptions,
        grid: 12,
      },
      {
        type: 'text',
        name: 'projectName',
        label: 'Project Name (Optional)',
        placeholder: 'e.g. Website Overhaul',
        grid: 6,
      },
      {
        type: 'select',
        name: 'assignedTo',
        label: 'Assign Complaint To',
        rules: { required: 'Assignee is required' },
        options: userOptions,
        grid: 6,
      },
      {
        type: 'select',
        name: 'priority',
        label: 'Priority',
        rules: { required: 'Priority is required' },
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
        grid: 6,
      },
      {
        type: 'date',
        name: 'dueDate',
        label: 'Due Date',
        grid: 6,
      },
      {
        type: 'text',
        name: 'title',
        label: 'Complaint Summary',
        placeholder: 'Brief subject of the issue',
        rules: { required: 'Summary title is required' },
        grid: 12,
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Detailed Complaint Description',
        placeholder: 'Explain the details of the problem...',
        rules: { required: 'Description is required' },
        grid: 12,
      },
    ],
    [customerOptions, userOptions]
  );

  const updateFormConfig = useMemo<FormField[]>(() => {
    if (!selectedTicket) return [];
    return [
      {
        type: 'select',
        name: 'actionType',
        label: 'Select Action',
        rules: { required: 'Action is required' },
        options: [
          { label: 'Reviewed & Started', value: 'reviewed_started' },
          { label: 'Mark In Progress', value: 'in_progress' },
          { label: 'Reassign Ticket', value: 'reassign' },
          { label: 'Complete / Resolve Ticket', value: 'completed' },
        ],
        grid: 12,
        disabled: !hasEditAccess,
      },
      {
        type: 'select',
        name: 'newAssignee',
        label: 'Reassign To (Only if Reassigning)',
        options: userOptions,
        grid: 12,
        disabled: !hasEditAccess,
      },
      {
        type: 'select',
        name: 'priority',
        label: 'Priority',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
        grid: 6,
        disabled: !hasEditAccess,
      },
      {
        type: 'date',
        name: 'dueDate',
        label: 'Due Date',
        grid: 6,
        disabled: !hasEditAccess,
      },
      {
        type: 'textarea',
        name: 'comment',
        label: 'Action / Reassignment Comments',
        placeholder: 'Enter notes or comments regarding this update...',
        rules: { required: 'Comments are required' },
        grid: 12,
        disabled: !hasEditAccess,
      },
    ];
  }, [selectedTicket, userOptions, hasEditAccess]);

  // Submit new ticket
  const handleCreateSubmit = async (values: FormValues) => {
    try {
      const customerIdStr = String(values.customerId || '');
      const selectedCust = customers.find((c) => c.id === customerIdStr);
      const ticketPayload = {
        customerId: customerIdStr,
        companyName: selectedCust?.companyName || 'Unknown Customer',
        projectName: String(values.projectName || 'General Support'),
        assignedTo: String(values.assignedTo || ''),
        priority: String(values.priority || 'medium'),
        dueDate: String(values.dueDate || ''),
        title: String(values.title || ''),
        description: String(values.description || ''),
        createdBy: loggedInUsername,
      };

      await customerService.createTicket(ticketPayload);
      showSuccess('Support complaint ticket registered successfully.');
      setIsCreateOpen(false);
    } catch (err: any) {
      showError(err.message || 'Error registering support ticket.');
    }
  };

  // Submit ticket action update
  const handleUpdateSubmit = async (values: FormValues) => {
    if (!selectedTicket) return;
    try {
      let nextStatus = String(values.actionType || '');
      const isReassign = nextStatus === 'reassign';

      if (isReassign) {
        if (!values.newAssignee) {
          throw new Error('Please select a user to reassign the ticket to.');
        }
        nextStatus = 'not_started'; // Goes back to not_started notification flow for the new user
      }

      await customerService.updateTicketStatus(
        selectedTicket.id,
        nextStatus,
        String(values.comment || ''),
        loggedInUsername,
        isReassign ? String(values.newAssignee) : undefined,
        String(values.priority || ''),
        String(values.dueDate || '')
      );

      showSuccess('Support ticket updated successfully.');
      setIsUpdateOpen(false);
      setSelectedTicket(null);
    } catch (err: any) {
      showError(err.message || 'Error updating support ticket.');
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Chip label={t('notStarted').toUpperCase()} color="error" size="small" />;
      case 'reviewed_started':
        return <Chip label={t('reviewedStarted').toUpperCase()} color="info" size="small" />;
      case 'in_progress':
        return <Chip label={t('inProgress').toUpperCase()} color="warning" size="small" />;
      case 'completed':
        return <Chip label={t('completed').toUpperCase()} color="success" size="small" />;
      default:
        return <Chip label={status.toUpperCase()} size="small" />;
    }
  };

  // Map tickets for ReusableDataGrid
  const gridRows = useMemo(() => {
    return displayedTickets.map((t) => ({
      id: t.id,
      title: t.title,
      company: t.companyName,
      project: t.projectName,
      assigned: `@${t.assignedTo}`,
      status: t.status ? t.status.toUpperCase().replace('_', ' & ') : t('notStarted').toUpperCase(),
      created: new Date(t.createdAt).toLocaleString('en-IN'),
      raw: t,
    }));
  }, [displayedTickets, t]);

  const handleGridAction = useCallback((row: any) => {
    setSelectedTicket(row.raw);
    setIsUpdateOpen(true);
  }, []);

  return (
    <AppLayout title="Training Trains CRM">
      <PageHeader>
        <PageTitle>{t('tickets')}</PageTitle>
        {hasPermission('TICKET_CREATE') && (
          <PrimaryButton type="button" variant="contained" onClick={() => setIsCreateOpen(true)}>
            {t('registerComplaint')}
          </PrimaryButton>
        )}
      </PageHeader>

      <Box sx={{ mt: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            indicatorColor="primary"
            textColor="primary"
            sx={{ px: 2, borderBottom: '1px solid var(--border)' }}
          >
            <Tab label={`${t('assignedToMe')} (${myTickets.length})`} />
            <Tab label={`${t('allTickets')} (${tickets.length})`} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {myTickets.some((t) => t.status === 'not_started') && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: '#ffebee',
                  color: '#c62828',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  border: '1px solid #ffcdd2',
                }}
              >
                <ConfirmationNumberIcon />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  You have support complaint tickets that are NOT YET STARTED. Please review and
                  start them to dismiss notifications.
                </Typography>
              </Box>
            )}

            {gridRows.length === 0 ? (
              <Box sx={{ py: 5, textAlign: 'center' }}>
                <Typography color="textSecondary">No complaint tickets logged here.</Typography>
              </Box>
            ) : (
              <ReusableDataGrid data={gridRows} onView={handleGridAction} />
            )}
          </Box>
        </Paper>
      </Box>

      {/* CREATE COMPLAINT MODAL */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Register Support Complaint</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={createFormConfig}
              onSubmit={handleCreateSubmit}
              submitLabel="Register Complaint"
              onCancel={() => setIsCreateOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* UPDATE STATUS / ACTION MODAL */}
      <Dialog open={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Update Support Ticket State</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f7fb', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {selectedTicket.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {selectedTicket.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Status:
                </Typography>
                {getStatusChip(selectedTicket.status)}
                <Typography variant="caption" sx={{ ml: 2, fontWeight: 600 }}>
                  Assigned To:
                </Typography>
                <Chip label={`@${selectedTicket.assignedTo}`} size="small" variant="outlined" />
              </Box>
            </Box>
          )}
          {selectedTicket && !hasEditAccess && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: '#fff5f5',
                border: '1px solid #ffe3e3',
                borderRadius: 1,
                color: 'error.main',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Insufficient Permissions: Only the assigned user or an administrator can modify this
                ticket.
              </Typography>
            </Box>
          )}
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={updateFormConfig}
              onSubmit={handleUpdateSubmit}
              submitLabel="Update Ticket"
              defaultValues={updateDefaultValues}
              onCancel={() => setIsUpdateOpen(false)}
              disabled={!hasEditAccess}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
