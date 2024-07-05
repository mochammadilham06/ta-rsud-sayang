import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useFormik } from 'formik';
import { YupValidation, initialValue } from '@/constant/initialValue';
import { get, includes, isEmpty, omit } from 'lodash';
import LoadingOverlay from '@/components/loading';
import { useRegister } from '@/api';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { showResponseModal } from '@/components/response-alert';

const Register = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Register'));
  }, [dispatch]);

  const router = useRouter();
  const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark';

  const { register, error, loading } = useRegister();

  const { handleChange, handleSubmit, values, errors, isValid, resetForm } = useFormik({
    initialValues: initialValue,
    validationSchema: YupValidation,
    // @ts-ignore
    onSubmit: async (values) => {
      try {
        const payload = omit(values, ['confirmPassword']);
        const response = await register({
          variables: { objects: payload },
        });
        showResponseModal(true, 'Registration Successful');
        if (response) {
          setTimeout(() => {
            router.push('/auth/login');
          }, 500);
        }
        resetForm();
      } catch (err: any) {
        const message = get(err, 'message');
        showResponseModal(false, includes('field', message) ? 'Invalid field input' : err?.message);
      }
    },
  });
  return (
    <Fragment>
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-dark' : 'bg-light'} bg-[url('/assets/images/blur-bg-rs.jpg')] bg-cover bg-center`}>
        <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
          <h2 className="mb-3 text-2xl font-bold">Sign Up</h2>
          <p className="mb-7">Enter your email and password to register</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className={!isEmpty(errors.fullname) ? 'has-error' : ''}>
              <label htmlFor="fullname">Full Name</label>
              <input id="fullname" type="text" className="form-input" placeholder="Enter Name" onChange={handleChange} value={values.fullname} />
              {errors.fullname && <div className="mt-1 text-danger">{errors.fullname}</div>}
            </div>
            <div className={!isEmpty(errors.username) ? 'has-error' : ''}>
              <label htmlFor="username">Username</label>
              <input id="username" type="text" className="form-input" placeholder="Enter Username" onChange={handleChange} value={values.username} />
              {errors.username && <div className="mt-1 text-danger">{errors.username}</div>}
            </div>
            <div className={!isEmpty(errors.address) ? 'has-error' : ''}>
              <label htmlFor="address">Address</label>
              <input id="address" type="text" className="form-input" placeholder="Enter Address" onChange={handleChange} value={values.address} />
              {errors.address && <div className="mt-1 text-danger">{errors.address}</div>}
            </div>
            <div className={!isEmpty(errors.email) ? 'has-error' : ''}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" placeholder="Enter Email" onChange={handleChange} value={values.email} />
              {errors.email && <div className="mt-1 text-danger">{errors.email}</div>}
            </div>
            <div className={!isEmpty(errors.password) ? 'has-error' : ''}>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="Enter Password" onChange={handleChange} value={values.password} />
              {errors.password && <div className="mt-1 text-danger">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {loading ? 'Loading...' : 'SIGN UP'}
            </button>
          </form>

          <p className="py-5 text-center">
            Already have an account?
            <Link href="/auth/login" className="ml-1 font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {loading && <LoadingOverlay />}
    </Fragment>
  );
};

Register.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie('users', { req, res });
  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Register;
