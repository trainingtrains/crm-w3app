import { type ReactNode, useMemo } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import AppHeader from './AppHeader';
import SideNavigation, { type NavigationItem } from './SideNavigation';


import { useAuth } from '../context/AuthContext';

interface AppLayoutProps {
    title?: string;
    children: ReactNode;
}

const AppLayout = ({
    title = "W3App Developers",
    children,
}: AppLayoutProps) => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const navigationItems =
        useMemo<NavigationItem[]>(
            () => [
                {
                    id: 'admin',
                    title: 'Admin',
                    path: '/admin',
                    icon: <ManageAccountsRoundedIcon />,
                },
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    path: '/dashboard',
                    icon: <DashboardRoundedIcon />,
                },
                {
                    id: 'customer',
                    title: 'Customers',
                    path: '/crm',
                    icon: <GroupsRoundedIcon />,
                },
                {
                    id: 'newCustomer',
                    title: 'New',
                    path: '/newCust',
                    icon: <PersonAddRoundedIcon />,
                },
            ],
            []
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
                onHome={() => navigate('/crm')}
                onLogout={handleLogout}
            />

            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <SideNavigation
                    items={navigationItems}
                />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 3,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;