import * as Yup from 'yup';

export const initialValue = {
  address: '',
  email: '',
  fullname: '',
  username: '',
  user_type: 'pasien',
  password: '',
  confirmPassword: '',
};

export const YupValidation = Yup.object().shape({
  fullname: Yup.string().required('Please fill the Name'),
  address: Yup.string().required('Please fill the address'),
  email: Yup.string().email('Must required email format').required('Please fill the email'),
  username: Yup.string().required('Please fill the username'),
  password: Yup.string().required('Please fill the password'),
});

export const loginValidation = Yup.object().shape({
  username: Yup.string().required('Please fill the username'),
  password: Yup.string().required('Please fill the password'),
});

export const regisValidation = Yup.object().shape({
  type: Yup.string().required('Please fill the type'),
});

export const statusClassMap = {
  Approved: 'bg-success',
  Completed: 'bg-success',
  Pending: 'bg-warning',
  'In Progress': 'bg-warning',
  Rejected: 'bg-danger',
};
