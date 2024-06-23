import CONST from '@/utils/getEnv';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: CONST.BASE_URL_REST,
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': `${CONST.BASE_KEY}`,
  },
});

export default axiosInstance;
