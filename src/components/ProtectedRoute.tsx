import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({
    children,
}: Props) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;