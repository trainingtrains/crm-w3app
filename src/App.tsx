import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppProvider';
import GlobalDialog from './layouts/GlobalDialog';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalDialog />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
