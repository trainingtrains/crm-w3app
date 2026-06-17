import { BrowserRouter } from 'react-router-dom';

import PageContainer from './atoms/PageContainer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <PageContainer>
        <AppRoutes />
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
