import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { deleteDoctorById, getDoctorById, getDoctorService, registerService, updateDoctorById } from '@/services';
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

export const useGetDoctor = (user_type: string[]) => {
  const {
    data: dataTask,
    loading: loadingTask,
    error: errorTask,
  } = useSubscription(getDoctorService, {
    variables: {
      user_type: user_type,
    },
  });

  return {
    dataTask,
    loadingTask,
    errorTask,
  };
};
export const useGetDoctorById = (user_id: string | string[] | undefined) => {
  const {
    data: dataTask,
    loading: loadingTask,
    error: errorTask,
  } = useQuery(getDoctorById, {
    variables: {
      id: user_id,
    },
  });

  return {
    dataTask,
    loadingTask,
    errorTask,
  };
};

export const useUpdateDoctor = () => {
  const [update, { error, loading }] = useMutation(updateDoctorById);
  return {
    update,
    loading,
    error,
  };
};
export const useDeleteDoctor = () => {
  const [deletes, { error, loading }] = useMutation(deleteDoctorById);
  return {
    deletes,
    loading,
    error,
  };
};
