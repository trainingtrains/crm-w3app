import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './context/LoadingContext';
import { NotificationProvider } from './context/NotificationContext';
import GlobalProgress from './layouts/GlobalProgress';
import GlobalDialog from './layouts/GlobalDialog';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <NotificationProvider>
            <GlobalProgress />
            <GlobalDialog />
            <AppRoutes />
          </NotificationProvider>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
