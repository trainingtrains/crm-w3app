import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

import { useNotification } from '../context/NotificationContext';

const GlobalDialog = () => {
    const { notification, close } = useNotification();

    return (
        <Dialog
            open={notification.open}
            onClose={
                notification.type === 'success'
                    ? undefined
                    : close
            }
        >
            <DialogTitle>{notification.title}</DialogTitle>

            <DialogContent>
                <Typography>{notification.message}</Typography>
            </DialogContent>

            {notification.type !== 'success' && (
                <DialogActions>
                    <Button onClick={close}>Close</Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default GlobalDialog;