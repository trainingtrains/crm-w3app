import GridPatternDesign from '../../layouts/GridPatternDesign';
import Banner from '../../layouts/Banner';
import FormPanel from '../../layouts/FormPanel';
import { loginConfig } from './config';
import { CONSTANTS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (data) => {
    console.log(data);
    await login(data);
  };

  return (
    <GridPatternDesign>
      <Banner />
      <FormPanel
        title={CONSTANTS.LBL_LOGIN}
        config={loginConfig}
        handleSubmit={handleLogin}
        submitLabel={CONSTANTS.LBL_LOGIN}
      />
    </GridPatternDesign>
  );
};

export default LoginPage;
