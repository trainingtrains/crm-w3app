import { type MouseEvent, useState } from 'react';

import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export interface AppHeaderProps {
    title: string;
    username: string;
    onHome: () => void;
    onLogout: () => void;
}

const AppHeader = ({
    title,
    username,
    onHome,
    onLogout,
}: AppHeaderProps) => {
    const [anchorEl, setAnchorEl] =
        useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (
        event: MouseEvent<HTMLElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 72,
                    px: 3,
                }}
            >
                {/* Left */}

                <Stack
                    direction="row"
                    sx={{
                        spacing: 2,
                        alignItems: "center"
                    }}
                >
                    <IconButton
                        color="primary"
                        onClick={onHome}
                    >
                        <HomeRoundedIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        {title}
                    </Typography>
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                {/* Right */}

                <Stack
                    direction="row"
                    sx={{
                        spacing: 2,
                        alignItems: "center"
                    }}
                >
                    <IconButton color="inherit">
                        <NotificationsNoneRoundedIcon />
                    </IconButton>

                    <Divider
                        orientation="vertical"
                        sx={{
                            height: 32,
                        }}
                    />

                    <Stack
                        direction="row"

                        sx={{
                            cursor: 'pointer',
                            spacing: 1.5,
                            alignItems: "center"
                        }}
                        onClick={handleOpen}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                            }}
                        >
                            {username.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box>
                            <Typography
                                sx={{ fontWeight: 600 }}
                            >
                                {username}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Administrator
                            </Typography>
                        </Box>
                    </Stack>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                elevation: 3,
                                sx: {
                                    minWidth: 220,
                                    mt: 1,
                                    borderRadius: 2,
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <PersonRoundedIcon fontSize="small" />
                            </ListItemIcon>

                            <ListItemText>
                                Profile
                            </ListItemText>
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            onClick={() => {
                                handleClose();
                                onLogout();
                            }}
                        >
                            <ListItemIcon>
                                <LogoutRoundedIcon
                                    color="error"
                                    fontSize="small"
                                />
                            </ListItemIcon>

                            <ListItemText>
                                Logout
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;