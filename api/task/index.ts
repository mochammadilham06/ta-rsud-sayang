import { getTaskDokter, getTaskPasien, getTaskWithId, postImages, postTask, updateTask } from '@/services';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { isUndefined } from 'lodash';

export default function UseSubsciptionPassangers(status: any[], user_id?: any) {
  const services = isUndefined(user_id) ? getTaskDokter : getTaskPasien;
  const {
    data: dataTask,
    loading: loadingTask,
    error: errorTask,
  } = useSubscription(services, {
    variables: { user_id, status: status },
  });

  return {
    dataTask,
    loadingTask,
    errorTask,
  };
}

export const UseSubsciptionPassangersWithId = (user_id: any, task_id: any) => {
  const {
    data: dataTask,
    loading: loadingTask,
    error: errorTask,
  } = useQuery(getTaskWithId, {
    variables: { user_id, ...task_id },
  });

  return {
    dataTask,
    loadingTask,
    errorTask,
  };
};

export const usePostTask = () => {
  const [postTasks, { error, loading }] = useMutation(postTask);
  return {
    postTasks,
    loading,
    error,
  };
};

export const useUpdateTask = () => {
  const [updateThisTask, { loading: loadingUpdate, error: errorUpdate }] = useMutation(updateTask, {
    refetchQueries: [getTaskPasien],
  });

  return {
    updateThisTask,
    loadingUpdate,
    errorUpdate,
  };
};
export const usePostImage = () => {
  const [postImage, { loading, error }] = useMutation(postImages);

  return {
    postImage,
    loading,
    error,
  };
};
