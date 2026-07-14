import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Box, Stack, Tooltip, Badge } from '@mui/material';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: ReactNode;
  roles?: string[];
  badge?: number;
  disabled?: boolean;
  children?: NavigationItem[];
}

interface SideNavigationProps {
  items: NavigationItem[];
}

const DRAWER_WIDTH = 60;

const SideNavigation = ({ items }: SideNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        minWidth: DRAWER_WIDTH,
        bgcolor: '#16213E',
        color: '#fff',
        borderRight: '1px solid rgba(255,255,255,.08)',
        display: 'flex',
        flexDirection: 'column',
        py: 1,
      }}
    >
      <Stack spacing={1}>
        {items.map((item) => {
          const active = location.pathname.includes(item.path);

          return (
            <Tooltip key={item.id} title={item.title} placement="right">
              <Box
                onClick={() => !item.disabled && navigate(item.path)}
                sx={{
                  cursor: item.disabled ? 'not-allowed' : 'pointer',

                  opacity: item.disabled ? 0.4 : 1,

                  py: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',

                  transition: '.25s',

                  bgcolor: active ? 'primary.main' : 'transparent',

                  '&:hover': {
                    bgcolor: item.disabled ? 'transparent' : 'primary.dark',
                  },
                }}
              >
                <Badge badgeContent={item.badge} color="error" max={99}>
                  {item.icon}
                </Badge>
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default memo(SideNavigation);
