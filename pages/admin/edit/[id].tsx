import { useGetDoctorById, useUpdateDoctor } from '@/api';
import Button from '@/components/button';
import LoadingOverlay from '@/components/loading';
import { showResponseModal } from '@/components/response-alert';
import { YupValidation } from '@/constant/initialValue';
import { setPageTitle } from '@/store/themeConfigSlice';
import { getCookie } from 'cookies-next';
import { useFormik } from 'formik';
import { get, includes, isEmpty } from 'lodash';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
export default function UploadResults() {
  useEffect(() => {
    dispatch(setPageTitle('Upload File'));
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const { dataTask, errorTask, loadingTask } = useGetDoctorById(router?.query?.id);
  const { error, loading, update } = useUpdateDoctor();
  console.log({ dataTask });

  const { handleChange, handleSubmit, resetForm, errors, values, setFieldValue, setValues } = useFormik({
    initialValues: {
      address: '',
      email: '',
      fullname: '',
      username: '',
      user_type: '',
      password: '',
    },
    validationSchema: YupValidation,
    onSubmit: async (values) => {
      try {
        const response = await update({
          variables: {
            id: dataTask?.data[0]?.id,
            set: {
              ...values,
            },
          },
        });
        console.log({ response });
        showResponseModal(true, 'Registration Successful');
        setTimeout(() => {
          router.back();
        }, 500);
        resetForm();
      } catch (err: any) {
        const message = get(err, 'message');
        showResponseModal(false, includes('field', message) ? 'Invalid field input' : err?.message);
      }
    },
  });

  useEffect(() => {
    if (dataTask?.data) {
      const userData = dataTask.data[0];
      setValues({
        address: userData.address || '',
        email: userData.email || '',
        fullname: userData.fullname || '',
        username: userData.username || '',
        user_type: userData.user_type || '',
        password: '', // Reset password field for security
      });
    }
  }, [dataTask]);

  const options = [
    { label: 'Dokter Poli', value: 'dokter-poli' },
    { label: 'Dokter Radiologi', value: 'dokter-radiologi' },
  ];

  return (
    <Fragment>
      <div className="panel" id="single_file">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Edit data</h5>
        </div>
        <form className="grid grid-cols-2 gap-x-3 gap-y-1 pt-5">
          <div className={!isEmpty(errors.fullname) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              Fullname
            </label>
            <input id="fullname" type="text" className="form-input" placeholder="Fill Fullname" name="fullname" onChange={handleChange} value={values.fullname} />
            {errors.fullname && <div className="mt-1 text-danger">{errors.fullname}</div>}
          </div>
          <div className={!isEmpty(errors.username) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              Username
            </label>
            <input id="username" type="text" className="form-input" placeholder="Fill Username" name="username" onChange={handleChange} value={values.username} disabled />
            {errors.username && <div className="mt-1 text-danger">{errors.username}</div>}
          </div>
          <div className={!isEmpty(errors.email) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              Email
            </label>
            <input id="email" type="email" className="form-input" placeholder="Fill Email" name="email" onChange={handleChange} value={values.email} />
            {errors.email && <div className="mt-1 text-danger">{errors.email}</div>}
          </div>
          <div className={!isEmpty(errors.address) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              address
            </label>
            <input id="address" type="address" className="form-input" placeholder="Fill Address" name="address" onChange={handleChange} value={values.address} />
            {errors.address && <div className="mt-1 text-danger">{errors.address}</div>}
          </div>
          <div className={!isEmpty(errors.user_type) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              Usertype
            </label>
            <Select
              id="user_type"
              className="overflow-visible"
              placeholder="Select User Type"
              options={options}
              name="user_type"
              onChange={(option) => setFieldValue('user_type', option?.value)}
              value={options.find((option) => option.value === values.user_type)}
            />
            {errors.user_type && <div className="mt-1 text-danger">{errors.user_type}</div>}
          </div>
          <div className={!isEmpty(errors.password) ? 'has-error' : ''}>
            <label htmlFor="password" className="font-bold text-black">
              Password
            </label>
            <input id="password" type="password" className="form-input" placeholder="Enter Password" name="password" onChange={handleChange} value={values?.password} />
            {errors.password && <div className="mt-1 text-danger">{errors.password}</div>}
          </div>
        </form>
      </div>

      {(loadingTask || loading) && <LoadingOverlay />}
      <div className="flex justify-end gap-3 py-5">
        <Button variant="danger" title="cancel" onAction={() => router.back()} />
        <Button variant="primary" title="Submit" onAction={handleSubmit} />
      </div>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie('users', { req, res });
  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
