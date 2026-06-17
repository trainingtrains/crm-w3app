import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export const customers = [
  {
    id: 1,
    customerName: 'John Smith',
    companyName: 'ABC Technologies',
    mobile: '9876543210',
    email: 'john@abc.com',
    status: 'Active',
  },
  {
    id: 2,
    customerName: 'David Kumar',
    companyName: 'Training Trains',
    mobile: '9876543211',
    email: 'david@test.com',
    status: 'Pending',
  },
  {
    id: 3,
    customerName: 'Priya Raj',
    companyName: 'EroSolar',
    mobile: '9876543212',
    email: 'priya@test.com',
    status: 'Active',
  },
];

export const stats = [
  {
    label: 'Total Customers',
    value: 250,
    icon: <PeopleAltOutlinedIcon color="primary" fontSize="large" />,
  },
  {
    label: 'New Customers',
    value: 32,
    icon: <PersonAddAltOutlinedIcon color="success" fontSize="large" />,
  },
  {
    label: 'Active Customers',
    value: 180,
    icon: <CheckCircleOutlineOutlinedIcon color="info" fontSize="large" />,
  },
];
