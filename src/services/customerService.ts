// src/services/customerService.ts

import { get, push, ref, update, remove, onValue } from 'firebase/database';
import { db } from '../db/firebase';
import { auditService } from './auditService';
import { timelineService } from './timelineService';

export const customerService = {
  async create(customer: any) {
    try {
      const customersRef = ref(db, 'customers');
      const snapshot = await get(customersRef);

      const customers = snapshot.exists() ? snapshot.val() : {};

      // Check duplicate customer
      const exists = Object.values(customers).some(
        (c: any) =>
          c.companyName?.trim().toLowerCase() === customer.companyName?.trim().toLowerCase() &&
          c.contactPerson?.trim().toLowerCase() === customer.contactPerson?.trim().toLowerCase() &&
          c.mobile?.trim() === customer.mobile?.trim()
      );

      if (exists) {
        throw new Error(
          'Customer already exists with the same Company Name, Contact Person and Mobile Number.'
        );
      }

      // Generate Customer ID
      const prefix = 'TTCL';

      const maxNumber = Object.values(customers).reduce((max: number, c: any) => {
        const num = Number((c.customerId || '').replace(prefix, ''));
        return Number.isNaN(num) ? max : Math.max(max, num);
      }, 0);

      const customerId = `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;

      // Get selected city id
      const cityId =
        typeof customer.city === 'object' ? (customer.city?.value ?? '') : (customer.city ?? '');

      const { city, ...customerData } = customer;

      const now = Date.now();

      // Calculation of financial balance and status
      const totalAmt = Number(customerData.totalAmount) || 0;
      const paidAmt = Number(customerData.paidAmount) || 0;
      const balanceAmt = totalAmt - paidAmt;
      const payStatus = paidAmt === 0 ? 'unpaid' : paidAmt >= totalAmt ? 'paid' : 'partial';

      const customerRef = await push(customersRef, {
        customerId,
        ...customerData,
        cityId,
        totalAmount: totalAmt,
        paidAmount: paidAmt,
        balanceAmount: balanceAmt,
        paymentStatus: payStatus,
        status: 'ACTIVE',
        serviceStartDate: now,
        serviceEndDate: null,
        deactivatedBy: '',
        deactivationReason: '',
        assignedEmployee: customerData.assignedEmployee || '',
        createdAt: now,
        updatedAt: now,
      });

      await timelineService.logEvent(customerRef.key!, 'Customer Created', 'Customer onboarding completed');

      return {
        id: customerRef.key,
        customerId,
      };
    } catch (error) {
      console.error('Create Customer Error:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const snapshot = await get(ref(db, `customers/${id}`));

      if (!snapshot.exists()) {
        throw new Error('Customer not found.');
      }

      const val = snapshot.val();
      return {
        id,
        ...val,
        status: val.status || 'ACTIVE',
        serviceStartDate: val.serviceStartDate || val.createdAt || null,
        serviceEndDate: val.serviceEndDate || null,
        deactivatedBy: val.deactivatedBy || '',
        deactivationReason: val.deactivationReason || '',
        assignedEmployee: val.assignedEmployee || '',
      };
    } catch (error) {
      console.error('Get Customer Error:', error);
      throw error;
    }
  },

  async delete(id: string, deactivatedBy: string = 'System', deactivationReason: string = 'Requested') {
    try {
      const customerRef = ref(db, `customers/${id}`);
      const snapshot = await get(customerRef);

      if (!snapshot.exists()) {
        throw new Error('Customer not found.');
      }

      const now = Date.now();
      await update(customerRef, {
        status: 'INACTIVE',
        serviceEndDate: now,
        deactivatedBy,
        deactivationReason,
        updatedAt: now,
      });

      await timelineService.logEvent(id, 'Service Ended', `Service ended / Customer deactivated by ${deactivatedBy}. Reason: ${deactivationReason}`);

      return {
        success: true,
        message: 'Customer soft-deactivated successfully.',
      };
    } catch (error) {
      console.error('Delete Customer Error:', error);
      throw error;
    }
  },

  async activate(id: string) {
    try {
      const customerRef = ref(db, `customers/${id}`);
      const snapshot = await get(customerRef);

      if (!snapshot.exists()) {
        throw new Error('Customer not found.');
      }

      const now = Date.now();
      await update(customerRef, {
        status: 'ACTIVE',
        serviceStartDate: now,
        serviceEndDate: null,
        deactivatedBy: '',
        deactivationReason: '',
        updatedAt: now,
      });

      await timelineService.logEvent(id, 'Service Reactivated', 'Customer reactivated, service resumed');

      return {
        success: true,
        message: 'Customer activated successfully.',
      };
    } catch (error) {
      console.error('Activate Customer Error:', error);
      throw error;
    }
  },

  async searchCustomers(filters: {
    custId?: string;
    custName?: string;
    mobile?: string;
    city?: string;
    status?: string;
    serviceStartDate?: string | null;
    serviceEndDate?: string | null;
    assignedEmployee?: string;
    userRole?: string;
    username?: string;
  }) {
    const snapshot = await get(ref(db, 'customers'));

    if (!snapshot.exists()) return [];

    const userRole = filters.userRole || 'ADMIN';
    const username = filters.username || '';
    const filterStatus = filters.status || 'ALL';
    const filterStartDate = filters.serviceStartDate || null;
    const filterEndDate = filters.serviceEndDate || null;
    const filterEmployee = filters.assignedEmployee || '';

    const customers = Object.entries(snapshot.val()).map(([key, value]: any) => ({
      id: key,
      ...value,
      status: value.status || 'ACTIVE',
      serviceStartDate: value.serviceStartDate || value.createdAt || null,
      serviceEndDate: value.serviceEndDate || null,
      assignedEmployee: value.assignedEmployee || '',
    }));

    const filteredCustomers = customers.filter((customer: any) => {
      // Visibility rules checks
      if (userRole === 'VIEWER' && customer.status !== 'ACTIVE') {
        return false;
      }
      if (userRole === 'SUPPORT') {
        if (customer.status !== 'ACTIVE') return false;
        if (customer.assignedEmployee && customer.assignedEmployee !== username) return false;
      }

      // Filter settings checks
      if (filterStatus === 'ACTIVE' && customer.status !== 'ACTIVE') return false;
      if (filterStatus === 'INACTIVE' && customer.status !== 'INACTIVE') return false;
      if (filterEmployee && customer.assignedEmployee !== filterEmployee) return false;
      
      if (filterStartDate && customer.serviceStartDate && customer.serviceStartDate < new Date(filterStartDate).getTime()) {
        return false;
      }
      if (filterEndDate && customer.serviceEndDate && customer.serviceEndDate > new Date(filterEndDate).getTime()) {
        return false;
      }

      const matchCustId =
        !filters.custId ||
        customer.customerId?.toLowerCase().includes(filters.custId.toLowerCase());

      const matchCustName =
        !filters.custName ||
        customer.companyName?.toLowerCase().includes(filters.custName.toLowerCase()) ||
        customer.contactPerson?.toLowerCase().includes(filters.custName.toLowerCase());

      const matchMobile = !filters.mobile || customer.mobile?.includes(filters.mobile);

      const matchCity = !filters.city || customer.cityId === filters.city;

      return matchCustId && matchCustName && matchMobile && matchCity;
    });

    return filteredCustomers.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  },

  async update(id: string, customer: any) {
    const totalAmt = Number(customer.totalAmount) || 0;
    const paidAmt = Number(customer.paidAmount) || 0;
    const balanceAmt = totalAmt - paidAmt;
    const payStatus = paidAmt === 0 ? 'unpaid' : paidAmt >= totalAmt ? 'paid' : 'partial';

    return update(ref(db, `customers/${id}`), {
      ...customer,
      totalAmount: totalAmt,
      paidAmount: paidAmt,
      balanceAmount: balanceAmt,
      paymentStatus: payStatus,
      updatedAt: Date.now(),
    });
  },

  // Real-time listener for customer searches
  subscribeCustomers(
    filters: {
      custId?: string;
      custName?: string;
      mobile?: string;
      city?: string;
      status?: string;
      serviceStartDate?: string | null;
      serviceEndDate?: string | null;
      assignedEmployee?: string;
      userRole?: string;
      username?: string;
    },
    callback: (customers: any[]) => void
  ) {
    const customersRef = ref(db, 'customers');
    return onValue(customersRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const userRole = filters.userRole || 'ADMIN';
      const username = filters.username || '';
      const filterStatus = filters.status || 'ALL';
      const filterStartDate = filters.serviceStartDate || null;
      const filterEndDate = filters.serviceEndDate || null;
      const filterEmployee = filters.assignedEmployee || '';

      const customers = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value,
        status: value.status || 'ACTIVE',
        serviceStartDate: value.serviceStartDate || value.createdAt || null,
        serviceEndDate: value.serviceEndDate || null,
        assignedEmployee: value.assignedEmployee || '',
      }));

      const filteredCustomers = customers.filter((customer: any) => {
        // Visibility rules checks
        if (userRole === 'VIEWER' && customer.status !== 'ACTIVE') {
          return false;
        }
        if (userRole === 'SUPPORT') {
          if (customer.status !== 'ACTIVE') return false;
          if (customer.assignedEmployee && customer.assignedEmployee !== username) return false;
        }

        // Filter parameters checks
        if (filterStatus === 'ACTIVE' && customer.status !== 'ACTIVE') return false;
        if (filterStatus === 'INACTIVE' && customer.status !== 'INACTIVE') return false;
        if (filterEmployee && customer.assignedEmployee !== filterEmployee) return false;
        
        if (filterStartDate && customer.serviceStartDate && customer.serviceStartDate < new Date(filterStartDate).getTime()) {
          return false;
        }
        if (filterEndDate && customer.serviceEndDate && customer.serviceEndDate > new Date(filterEndDate).getTime()) {
          return false;
        }

        const matchCustId =
          !filters.custId ||
          customer.customerId?.toLowerCase().includes(filters.custId.toLowerCase());

        const matchCustName =
          !filters.custName ||
          customer.companyName?.toLowerCase().includes(filters.custName.toLowerCase()) ||
          customer.contactPerson?.toLowerCase().includes(filters.custName.toLowerCase());

        const matchMobile = !filters.mobile || customer.mobile?.includes(filters.mobile);

        const matchCity = !filters.city || customer.cityId === filters.city;

        return matchCustId && matchCustName && matchMobile && matchCity;
      });

      const sorted = filteredCustomers.sort(
        (a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0)
      );
      callback(sorted);
    });
  },

  // Real-time listener for single customer details
  subscribeCustomerDetails(id: string, callback: (customer: any) => void) {
    const customerRef = ref(db, `customers/${id}`);
    return onValue(customerRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      const val = snapshot.val();
      callback({
        id,
        ...val,
        status: val.status || 'ACTIVE',
        serviceStartDate: val.serviceStartDate || val.createdAt || null,
        serviceEndDate: val.serviceEndDate || null,
        deactivatedBy: val.deactivatedBy || '',
        deactivationReason: val.deactivationReason || '',
        assignedEmployee: val.assignedEmployee || '',
      });
    });
  },

  // Task Management Helpers
  async addTask(customerId: string, task: any) {
    const tasksRef = ref(db, `tasks/${customerId}`);
    const now = Date.now();
    const newTaskRef = await push(tasksRef, {
      ...task,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    return newTaskRef.key;
  },

  async toggleTaskStatus(customerId: string, taskId: string, currentStatus: string) {
    const taskRef = ref(db, `tasks/${customerId}/${taskId}`);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return update(taskRef, {
      status: newStatus,
      updatedAt: Date.now(),
    });
  },

  async deleteTask(customerId: string, taskId: string) {
    const taskRef = ref(db, `tasks/${customerId}/${taskId}`);
    return remove(taskRef);
  },

  subscribeTasks(customerId: string, callback: (tasks: any[]) => void) {
    const tasksRef = ref(db, `tasks/${customerId}`);
    return onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const tasks = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value,
      }));
      tasks.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(tasks);
    });
  },

  // Follow-up Management Helpers
  async addFollowup(customerId: string, followup: any) {
    const followupsRef = ref(db, `followups/${customerId}`);
    const now = Date.now();
    const newFollowupRef = await push(followupsRef, {
      ...followup,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    return newFollowupRef.key;
  },

  async toggleFollowupStatus(customerId: string, followupId: string, currentStatus: string) {
    const followupRef = ref(db, `followups/${customerId}/${followupId}`);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return update(followupRef, {
      status: newStatus,
      updatedAt: Date.now(),
    });
  },

  async deleteFollowup(customerId: string, followupId: string) {
    const followupRef = ref(db, `followups/${customerId}/${followupId}`);
    return remove(followupRef);
  },

  subscribeFollowups(customerId: string, callback: (followups: any[]) => void) {
    const followupsRef = ref(db, `followups/${customerId}`);
    return onValue(followupsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const followups = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value,
      }));
      followups.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(followups);
    });
  },

  // Support Tickets Helpers
  async createTicket(ticket: any) {
    const ticketsRef = ref(db, 'tickets');
    const now = Date.now();
    const newTicket = {
      ...ticket,
      status: 'not_started',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: 'not_started',
          comment: 'Ticket registered/created',
          updatedBy: ticket.createdBy || 'System',
          timestamp: now,
        },
      ],
    };
    const ticketRef = await push(ticketsRef, newTicket);
    await auditService.logEvent(
      ticket.createdBy || 'System',
      'USER',
      `Registered new support complaint ticket: ${ticket.title} for customer ID ${ticket.customerId}`,
      'TICKETS'
    );
    
    // Log ticket timeline event under customer ID
    await timelineService.logEvent(ticket.customerId, 'Ticket Raised', `Subject: ${ticket.title}`);

    return ticketRef.key;
  },

  async updateTicketStatus(
    ticketId: string,
    status: string,
    comment: string,
    updatedBy: string,
    newAssignee?: string,
    priority?: string,
    dueDate?: string
  ) {
    const ticketRef = ref(db, `tickets/${ticketId}`);
    const snapshot = await get(ticketRef);
    if (!snapshot.exists()) {
      throw new Error('Ticket not found');
    }
    const currentTicket = snapshot.val();
    const now = Date.now();
    const historyItem = {
      status,
      comment: comment || `Status changed to ${status}`,
      updatedBy,
      timestamp: now,
      assignedTo: newAssignee || currentTicket.assignedTo,
      priority: priority || currentTicket.priority || 'medium',
      dueDate: dueDate || currentTicket.dueDate || '',
    };
    const currentHistory = currentTicket.history || [];

    const updates: any = {
      status,
      updatedAt: now,
      history: [...currentHistory, historyItem],
    };
    if (newAssignee) {
      updates.assignedTo = newAssignee;
    }
    if (priority) {
      updates.priority = priority;
    }
    if (dueDate) {
      updates.dueDate = dueDate;
    }

    await auditService.logEvent(
      updatedBy,
      'USER',
      `Updated support ticket ${ticketId} status to ${status} - Comments: ${comment}`,
      'TICKETS'
    );

    return update(ticketRef, updates);
  },

  subscribeCustomerTickets(customerId: string, callback: (tickets: any[]) => void) {
    const ticketsRef = ref(db, 'tickets');
    return onValue(ticketsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const allTickets = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value,
      }));
      const filtered = allTickets.filter((t) => t.customerId === customerId);
      filtered.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(filtered);
    });
  },

  subscribeAllTickets(callback: (tickets: any[]) => void) {
    const ticketsRef = ref(db, 'tickets');
    return onValue(ticketsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const allTickets = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value,
      }));
      allTickets.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(allTickets);
    });
  },
};
