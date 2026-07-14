import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';

import { useAuth } from '../../context/AuthContext';

import { StyledSection } from '../../atoms/StyledSection';
import { PageTitle } from '../../atoms/PageTitle';
import { PageHeader } from '../../atoms/PageHeader';
import { PrimaryButton } from '../../atoms/PrimaryButton';
import { SecondaryButton } from '../../atoms/SecondaryButton';
import { NegativeButton } from '../../atoms/NegativeButton';

import DetailsView from '../../layouts/DetailsView';
import CustomForm, { type FormValues } from '../../layouts/CustomForm';
import { CONSTANTS } from '../../constants';
import {
  customerDetailsConfig,
  projectTypeOptions,
  statusOptions,
  paymentUpdateConfig,
  taskAssignConfig,
  followupConfig,
} from './config/customerConfig';
import { customerService } from '../../services/customerService';
import UserService from '../../services/userService';
import AppLayout from '../../layouts/AppLayout';
import { useNotification } from '../../context/NotificationContext';
import type { FormField } from '../../layouts/types/form';

const progressUpdateConfig: FormField[] = [
  {
    type: 'select',
    name: 'status',
    label: 'Progress/Project Status',
    rules: { required: 'Status is required' },
    options: statusOptions,
    grid: 12,
  },
];

const getStatusChip = (status: string) => {
  switch (status) {
    case 'not_started':
      return <Chip label="NOT STARTED" color="error" size="small" />;
    case 'reviewed_started':
      return <Chip label="REVIEWED & STARTED" color="info" size="small" />;
    case 'in_progress':
      return <Chip label="IN PROGRESS" color="warning" size="small" />;
    case 'completed':
      return <Chip label="COMPLETED" color="success" size="small" />;
    default:
      return (
        <Chip
          label={String(status || '')
            .toUpperCase()
            .replace('_', ' & ')}
          size="small"
        />
      );
  }
};

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [appUsers, setAppUsers] = useState<any[]>([]);
  const [customerTickets, setCustomerTickets] = useState<any[]>([]);

  const loadUsers = useCallback(async () => {
    try {
      const list = await UserService.search({});
      setAppUsers(list || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Dialog open states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  // Subscribe to real-time updates for customer details
  useEffect(() => {
    if (!id) return;

    const unsubscribe = customerService.subscribeCustomerDetails(id, (data) => {
      setCustomer(data);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  // Subscribe to real-time updates for project tasks
  useEffect(() => {
    if (!id) return;

    const unsubscribe = customerService.subscribeTasks(id, (data) => {
      setTasks(data || []);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  // Subscribe to real-time updates for followups
  useEffect(() => {
    if (!id) return;

    const unsubscribe = customerService.subscribeFollowups(id, (data) => {
      setFollowups(data || []);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  // Subscribe to real-time updates for customer tickets
  useEffect(() => {
    if (!id) return;

    const unsubscribe = customerService.subscribeCustomerTickets(id, (data) => {
      setCustomerTickets(data || []);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    try {
      await customerService.delete(id);
      showSuccess('Customer deleted successfully.');
      navigate('/crm');
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Unable to delete customer.');
    }
  }, [id, navigate, showSuccess, showError]);

  const handleEdit = useCallback(() => {
    navigate(`/custEdit/${id}`);
  }, [id, navigate]);

  // Approve Lead Action
  const handleApprove = useCallback(async () => {
    if (!id || !customer) return;

    try {
      await customerService.update(id, {
        ...customer,
        status: 'approved',
      });
      showSuccess('Project approved successfully and moved to Approved stage.');
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Failed to approve project.');
    }
  }, [id, customer, showSuccess, showError]);

  // Submit handlers for dialogs
  const handleUpdatePaymentSubmit = useCallback(
    async (form: FormValues) => {
      if (!id || !customer) return;

      try {
        const totalAmount = Number(form.totalAmount) || 0;
        const paidAmount = Number(form.paidAmount) || 0;

        await customerService.update(id, {
          ...customer,
          totalAmount,
          paidAmount,
        });

        setIsPaymentOpen(false);
        showSuccess('Financial and payment status updated successfully.');
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Unable to update payment details.');
      }
    },
    [id, customer, showSuccess, showError]
  );

  const handleAddTaskSubmit = useCallback(
    async (form: FormValues) => {
      if (!id) return;

      try {
        await customerService.addTask(id, {
          title: String(form.title),
          assignedTo: String(form.assignedTo),
          dueDate: String(form.dueDate),
        });

        setIsTaskOpen(false);
        showSuccess('New project task assigned successfully.');
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Failed to assign task.');
      }
    },
    [id, showSuccess, showError]
  );

  const handleAddFollowupSubmit = useCallback(
    async (form: FormValues) => {
      if (!id) return;

      try {
        await customerService.addFollowup(id, {
          date: String(form.date),
          notes: String(form.notes),
        });

        setIsFollowupOpen(false);
        showSuccess('Customer followup logged successfully.');
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Failed to log followup.');
      }
    },
    [id, showSuccess, showError]
  );

  const handleRegisterComplaintSubmit = useCallback(
    async (form: FormValues) => {
      if (!id || !customer) return;

      try {
        const ticketPayload = {
          customerId: id,
          companyName: customer.companyName || 'Unknown Customer',
          projectName: String(form.projectName || 'General Support'),
          assignedTo: String(form.assignedTo || ''),
          title: String(form.title || ''),
          description: String(form.description || ''),
          createdBy: user?.username || 'System',
        };

        await customerService.createTicket(ticketPayload);
        setIsComplaintOpen(false);
        showSuccess('Support complaint ticket registered successfully.');
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Unable to register support ticket.');
      }
    },
    [id, customer, user, showSuccess, showError]
  );

  const handleUpdateProgressSubmit = useCallback(
    async (form: FormValues) => {
      if (!id || !customer) return;

      try {
        await customerService.update(id, {
          ...customer,
          status: String(form.status),
        });

        setIsProgressOpen(false);
        showSuccess('Project progress status updated successfully.');
      } catch (error: any) {
        console.error(error);
        showError(error.message || 'Unable to update progress.');
      }
    },
    [id, customer, showSuccess, showError]
  );

  // Toggle handlers for status checkmarks
  const handleToggleTask = useCallback(
    async (taskId: string, currentStatus: string) => {
      if (!id) return;

      try {
        await customerService.toggleTaskStatus(id, taskId, currentStatus);
      } catch (error: any) {
        console.error(error);
        showError('Unable to update task status.');
      }
    },
    [id, showError]
  );

  const handleToggleFollowup = useCallback(
    async (followupId: string, currentStatus: string) => {
      if (!id) return;

      try {
        await customerService.toggleFollowupStatus(id, followupId, currentStatus);
      } catch (error: any) {
        console.error(error);
        showError('Unable to update followup status.');
      }
    },
    [id, showError]
  );

  // Delete child records
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!id) return;

      try {
        await customerService.deleteTask(id, taskId);
        showSuccess('Task removed.');
      } catch (error: any) {
        console.error(error);
        showError('Failed to delete task.');
      }
    },
    [id, showSuccess, showError]
  );

  const handleDeleteFollowup = useCallback(
    async (followupId: string) => {
      if (!id) return;

      try {
        await customerService.deleteFollowup(id, followupId);
        showSuccess('Followup log removed.');
      } catch (error: any) {
        console.error(error);
        showError('Failed to delete followup.');
      }
    },
    [id, showSuccess, showError]
  );

  // Memoized values for lists and visual progress bars
  const projectProgress = useMemo(() => {
    if (!customer) return { value: 0, color: 'primary' as const };
    const s = String(customer.status || '').toLowerCase();
    switch (s) {
      case 'new':
        return { value: 15, color: 'info' as const };
      case 'requirement':
        return { value: 30, color: 'secondary' as const };
      case 'proposal':
        return { value: 45, color: 'warning' as const };
      case 'negotiation':
        return { value: 60, color: 'warning' as const };
      case 'approved':
        return { value: 75, color: 'success' as const };
      case 'development':
        return { value: 90, color: 'success' as const };
      case 'completed':
        return { value: 100, color: 'success' as const };
      case 'onhold':
        return { value: 50, color: 'info' as const };
      case 'rejected':
        return { value: 0, color: 'error' as const };
      default:
        return { value: 10, color: 'primary' as const };
    }
  }, [customer]);

  const paymentProgressPercent = useMemo(() => {
    if (!customer) return 0;
    const total = Number(customer.totalAmount) || 0;
    const paid = Number(customer.paidAmount) || 0;
    if (!total) return 0;
    return Math.min(Math.round((paid / total) * 100), 100);
  }, [customer]);

  const generalFields = useMemo(() => {
    const generalNames = [
      'customerId',
      'companyName',
      'contactPerson',
      'mobile',
      'email',
      'address',
      'createdAt',
      'updatedAt',
    ];
    return customerDetailsConfig.filter((f) => generalNames.includes(f.name));
  }, []);

  const taskFields = useMemo(() => {
    return taskAssignConfig.map((field) => {
      if (field.name === 'assignedTo') {
        return {
          ...field,
          type: 'select' as const,
          options: appUsers.map((u: any) => ({
            label: `${u.firstName} ${u.lastName || ''} (@${u.userName})`.trim(),
            value: u.userName,
          })),
        };
      }
      return field;
    });
  }, [appUsers]);

  const registerComplaintFields = useMemo<FormField[]>(() => {
    return [
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
        options: appUsers.map((u: any) => ({
          label: `${u.firstName} ${u.lastName || ''} (@${u.userName})`.trim(),
          value: u.userName,
        })),
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
    ];
  }, [appUsers]);

  const projectStatusLabel = useMemo(() => {
    if (!customer) return '-';
    const matched = statusOptions.find((o) => o.value === customer.status);
    return matched ? matched.label : customer.status || '-';
  }, [customer]);

  const projectTypeLabel = useMemo(() => {
    if (!customer) return '-';
    const matched = projectTypeOptions.find((o) => o.value === customer.projectType);
    return matched ? matched.label : customer.projectType || '-';
  }, [customer]);

  const isApproved = useMemo(() => {
    if (!customer) return false;
    const s = String(customer.status || '').toLowerCase();
    return ['approved', 'development', 'completed'].includes(s);
  }, [customer]);

  const paymentStatusChip = useMemo(() => {
    if (!customer) return null;
    const s = String(customer.paymentStatus || 'unpaid').toLowerCase();
    switch (s) {
      case 'paid':
        return <Chip size="small" label="FULLY PAID" color="success" />;
      case 'partial':
        return <Chip size="small" label="PARTIALLY PAID" color="warning" variant="outlined" />;
      case 'unpaid':
      default:
        return <Chip size="small" label="UNPAID" color="error" variant="outlined" />;
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  // Pre-populate values for update dialogs
  const paymentDefaultValues = {
    totalAmount: customer.totalAmount ?? 0,
    paidAmount: customer.paidAmount ?? 0,
  };

  const progressDefaultValues = {
    status: customer.status || '',
  };

  return (
    <AppLayout title="Training Trains CRM">
      <PageHeader>
        <PageTitle>{customer.companyName || CONSTANTS.LBL_CRM_CUST_DETAILS}</PageTitle>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <SecondaryButton type="button" variant="outlined" onClick={() => navigate('/crm')}>
            Back
          </SecondaryButton>
          <NegativeButton type="button" variant="outlined" onClick={handleDelete}>
            Delete
          </NegativeButton>
          <PrimaryButton type="button" variant="contained" onClick={handleEdit}>
            Edit Details
          </PrimaryButton>
        </Box>
      </PageHeader>

      <StyledSection>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* LEFT GRID: General details & Follow-ups */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* General Info View */}
            <Box
              sx={{
                p: 3,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                General Information
              </Typography>
              <DetailsView config={generalFields} data={customer} hideActions={true} plain={true} />
            </Box>

            {/* Followups Card */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Followup Schedule & Notes
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setIsFollowupOpen(true)}
                  >
                    Add Log
                  </Button>
                </Box>

                <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
                  {followups.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No followup logs recorded.
                    </Box>
                  ) : (
                    followups.map((log) => (
                      <Box key={log.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleFollowup(log.id, log.status)}
                            >
                              {log.status === 'completed' ? (
                                <CheckCircleRoundedIcon color="success" />
                              ) : (
                                <RadioButtonUncheckedRoundedIcon color="action" />
                              )}
                            </IconButton>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {log.date}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  textDecoration:
                                    log.status === 'completed' ? 'line-through' : 'none',
                                }}
                              >
                                {log.notes}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleDeleteFollowup(log.id)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Support Tickets Card */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Support Complaints & Tickets
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ConfirmationNumberRoundedIcon />}
                    onClick={() => setIsComplaintOpen(true)}
                  >
                    Register Complaint
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {customerTickets.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No complaint tickets logged.
                    </Box>
                  ) : (
                    customerTickets.map((ticket) => (
                      <Accordion
                        key={ticket.id}
                        elevation={0}
                        sx={{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm) !important',
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              alignItems: 'center',
                              pr: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {ticket.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Project: {ticket.projectName} | Assigned: @{ticket.assignedTo}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              {getStatusChip(ticket.status)}
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2 }}>
                          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                            {ticket.description}
                          </Typography>

                          <Divider sx={{ mb: 1.5 }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, display: 'block', mb: 1 }}
                          >
                            ACTION HISTORY LOGS:
                          </Typography>
                          <Stack spacing={1}>
                            {(ticket.history || []).map((log: any, idx: number) => (
                              <Box
                                key={idx}
                                sx={{ pl: 1.5, borderLeft: '2px solid var(--primary)', py: 0.5 }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: 600, display: 'block' }}
                                >
                                  {new Date(log.timestamp).toLocaleString('en-IN')} - Status:{' '}
                                  {log.status.toUpperCase().replace('_', ' & ')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.2 }}>
                                  {log.comment} (by @{log.updatedBy})
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT GRID: Projects, Tasks, and Payments */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Project Progress card & Approval option */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Project Progress Tracker
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={projectStatusLabel}
                      color={projectProgress.color}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <IconButton size="small" onClick={() => setIsProgressOpen(true)}>
                      <EditCalendarRoundedIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Project Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {customer.projectName || 'Not Assigned'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Project Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {projectTypeLabel}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Overall Progress
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {projectProgress.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={projectProgress.value}
                      color={projectProgress.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Project Description
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      p: 1.5,
                      backgroundColor: '#f9f9f9',
                      borderRadius: 1,
                      minHeight: 50,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {customer.projectDescription || 'No description provided.'}
                  </Typography>

                  {/* Approve Action button */}
                  {!isApproved && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<DoneAllRoundedIcon />}
                      fullWidth
                      sx={{ mt: 1.5, fontWeight: 'bold' }}
                      onClick={handleApprove}
                    >
                      Approve Project Lead
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Project Tasks Card */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Assigned Project Tasks
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setIsTaskOpen(true)}
                  >
                    Assign Task
                  </Button>
                </Box>

                <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
                  {tasks.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No tasks assigned for this customer.
                    </Box>
                  ) : (
                    tasks.map((task) => (
                      <Box key={task.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleTask(task.id, task.status)}
                            >
                              {task.status === 'completed' ? (
                                <CheckCircleRoundedIcon color="success" />
                              ) : (
                                <RadioButtonUncheckedRoundedIcon color="action" />
                              )}
                            </IconButton>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  textDecoration:
                                    task.status === 'completed' ? 'line-through' : 'none',
                                }}
                              >
                                {task.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 0.5 }}
                              >
                                Assigned to: {task.assignedTo || 'Unassigned'} | Due:{' '}
                                {task.dueDate || '-'}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Financial Summary Card */}
            <Card
              elevation={0}
              sx={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Financial Summary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {paymentStatusChip}
                    <IconButton size="small" onClick={() => setIsPaymentOpen(true)}>
                      <PaymentRoundedIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Contract Value
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ₹{(Number(customer.totalAmount) || 0).toLocaleString('en-IN')}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Amount Paid
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ₹{(Number(customer.paidAmount) || 0).toLocaleString('en-IN')}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: '#fff8f8',
                      borderRadius: 1,
                      border: '1px solid #ffe8e8',
                    }}
                  >
                    <Typography variant="caption" color="error.main" sx={{ fontWeight: 500 }}>
                      Outstanding Balance
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                      ₹{(Number(customer.balanceAmount) || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Payment Realization
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {paymentProgressPercent}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={paymentProgressPercent}
                      color={
                        paymentProgressPercent === 100
                          ? 'success'
                          : paymentProgressPercent > 0
                            ? 'warning'
                            : 'error'
                      }
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledSection>

      {/* DIALOGS FOR POPUP MODALS USING THE REUSABLE CUSTOMFORM COMPONENT */}

      {/* 1. Update Financials Dialog */}
      <Dialog open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Update Financials & Payments</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={paymentUpdateConfig}
              onSubmit={handleUpdatePaymentSubmit}
              submitLabel="Update"
              defaultValues={paymentDefaultValues}
              onCancel={() => setIsPaymentOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* 2. Assign Task Dialog */}
      <Dialog open={isTaskOpen} onClose={() => setIsTaskOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Assign Project Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={taskFields}
              onSubmit={handleAddTaskSubmit}
              submitLabel="Save"
              onCancel={() => setIsTaskOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* 3. Add Followup Dialog */}
      <Dialog
        open={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Schedule Followup Log</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={followupConfig}
              onSubmit={handleAddFollowupSubmit}
              submitLabel="Save"
              onCancel={() => setIsFollowupOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* 4. Update Progress Status Dialog */}
      <Dialog
        open={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Update Progress/Project Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={progressUpdateConfig}
              onSubmit={handleUpdateProgressSubmit}
              submitLabel="Update"
              defaultValues={progressDefaultValues}
              onCancel={() => setIsProgressOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* 5. Register Complaint Dialog */}
      <Dialog
        open={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Register Support Complaint</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CustomForm
              config={registerComplaintFields}
              onSubmit={handleRegisterComplaintSubmit}
              submitLabel="Register Complaint"
              onCancel={() => setIsComplaintOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
