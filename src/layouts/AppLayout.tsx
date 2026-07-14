import { type ReactNode, useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AppHeader from './AppHeader';
import SideNavigation, { type NavigationItem } from './SideNavigation';

import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

const AppLayout = ({ title = 'Training Trains', children }: AppLayoutProps) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const [ticketsBadgeCount, setTicketsBadgeCount] = useState(0);

  useEffect(() => {
    if (!user?.username) return;
    const unsubscribe = customerService.subscribeAllTickets((allTickets) => {
      const pendingCount = allTickets.filter(
        (t) => t.assignedTo === user.username && t.status === 'not_started'
      ).length;
      setTicketsBadgeCount(pendingCount);
    });
    return () => unsubscribe();
  }, [user?.username]);

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      {
        id: 'dashboard',
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardRoundedIcon />,
      },
      {
        id: 'admin',
        title: 'Admin',
        path: '/admin',
        icon: <ManageAccountsRoundedIcon />,
      },
      {
        id: 'customer',
        title: 'Customers',
        path: '/crm',
        icon: <GroupsRoundedIcon />,
      },
      {
        id: 'tickets',
        title: 'Support Tickets',
        path: '/tickets',
        icon: <ConfirmationNumberRoundedIcon />,
        badge: ticketsBadgeCount,
      },
    ],
    [ticketsBadgeCount]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#f5f7fb',
      }}
    >
      <AppHeader
        title={title}
        username={user?.username ?? ''}
        onHome={() => navigate('/dashboard')}
        onLogout={handleLogout}
      />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <SideNavigation items={navigationItems} />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
