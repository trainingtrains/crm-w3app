import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface Props {
    children: React.ReactNode;
}

const PublicRoute = ({
    children,
}: Props) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/crm" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;