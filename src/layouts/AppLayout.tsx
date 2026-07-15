import { type ReactNode, useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AppHeader from './AppHeader';
import SideNavigation, { type NavigationItem } from './SideNavigation';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { customerService } from '../services/customerService';

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

const AppLayout = ({ title = 'Training Trains', children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const navigationItems = useMemo<NavigationItem[]>(() => {
    const items: NavigationItem[] = [
      {
        id: 'dashboard',
        title: t('dashboard'),
        path: '/dashboard',
        icon: <DashboardRoundedIcon />,
      },
      {
        id: 'admin',
        title: t('adminPanel'),
        path: '/admin',
        icon: <ManageAccountsRoundedIcon />,
      },
      {
        id: 'customer',
        title: t('customers'),
        path: '/crm',
        icon: <GroupsRoundedIcon />,
      },
      {
        id: 'tickets',
        title: t('tickets'),
        path: '/tickets',
        icon: <ConfirmationNumberRoundedIcon />,
        badge: ticketsBadgeCount,
      },
      {
        id: 'reports',
        title: 'Reports',
        path: '/reports',
        icon: <BarChartRoundedIcon />,
      },
    ];

    // Hide Users module (admin panel) for SUPPORT role
    if (user?.role === 'SUPPORT') {
      return items.filter((item) => item.id !== 'admin' && item.id !== 'reports');
    }

    return items;
  }, [ticketsBadgeCount, t, user?.role]);

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
