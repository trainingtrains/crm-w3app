import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export type NotificationType =
    | 'success'
    | 'warning'
    | 'error'
    | 'info';

interface Notification {
    open: boolean;
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationContextType {
    showSuccess: (message: string) => void;
    showWarning: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    close: () => void;
    notification: Notification;
}

const NotificationContext =
    createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [notification, setNotification] =
        useState<Notification>({
            open: false,
            type: 'info',
            title: '',
            message: '',
        });

    const open = useCallback(
        (type: NotificationType, message: string) => {
            setNotification({
                open: true,
                type,
                title:
                    type.charAt(0).toUpperCase() + type.slice(1),
                message,
            });

            if (type === 'success') {
                setTimeout(() => {
                    setNotification((p) => ({
                        ...p,
                        open: false,
                    }));
                }, 3000);
            }
        },
        []
    );

    const close = useCallback(() => {
        setNotification((p) => ({
            ...p,
            open: false,
        }));
    }, []);

    const value = useMemo(
        () => ({
            notification,
            close,
            showSuccess: (m: string) => open('success', m),
            showWarning: (m: string) => open('warning', m),
            showError: (m: string) => open('error', m),
            showInfo: (m: string) => open('info', m),
        }),
        [notification, open, close]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotification must be used inside NotificationProvider'
        );
    }

    return context;
};