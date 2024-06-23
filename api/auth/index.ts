import { useMutation } from '@apollo/client';
import { registerService } from '@/services';
import axiosInstance from '@/config/axios-instance';

interface Login {
  username: string;
  password: string;
}

interface Register {
  address: string;
  username: string;
  fullname: string;
  password: string;
  user_type: string;
}

export const login = async (request: Login) => {
  try {
    const { data } = await axiosInstance.post('/rest/login', request);
    return data;
  } catch (error) {
    throw error;
  }
};

export const useRegister = () => {
  const [register, { error, loading }] = useMutation(registerService);
  return {
    register,
    loading,
    error,
  };
};
