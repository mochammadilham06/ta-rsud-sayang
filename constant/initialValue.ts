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

export const options = [
  { value: 'Thorax Pa/Ap', label: 'Thorax Pa/Ap' },
  { value: 'Thorax Pa/Lat', label: 'Thorax Pa/Lat' },
  { value: 'V.Cervical ap/Lat', label: 'V.Cervical ap/Lat' },
  { value: 'Pedis D/S', label: 'Pedis D/S' },
  { value: 'Manus D/S', label: 'Manus D/S' },
  { value: 'Scapula D/S', label: 'Scapula D/S' },
  { value: 'Pelvis', label: 'Pelvis' },
  { value: 'Mastoid S', label: 'Mastoid S' },
  { value: 'Abdomen 3 Posisi', label: 'Abdomen 3 Posisi' },
  { value: 'Abdomen polos', label: 'Abdomen polos' },
  { value: 'Abdomen 2 Posisi', label: 'Abdomen 2 Posisi' },
  { value: 'Babygram', label: 'Babygram' },
  { value: 'Cruris D/S', label: 'Cruris D/S' },
  { value: 'Kepala Ap/Lat', label: 'Kepala Ap/Lat' },
  { value: 'V.Lumbosaceal', label: 'V.Lumbosaceal' },
  { value: 'V.Thoracolumbal', label: 'V.Thoracolumbal' },
  { value: 'V.Lumbal Ap/Lat', label: 'V.Lumbal Ap/Lat' },
  { value: 'Waters', label: 'Waters' },
  { value: 'Humerus Ap/Lat D/S', label: 'Humerus Ap/Lat D/S' },
  { value: 'Genu D/S', label: 'Genu D/S' },
  { value: 'Femur D/S', label: 'Femur D/S' },
  { value: 'Wrist joint D/S', label: 'Wrist joint D/S' },
];
