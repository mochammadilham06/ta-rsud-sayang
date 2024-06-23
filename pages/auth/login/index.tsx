import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Fragment, useEffect, useState } from 'react';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useFormik } from 'formik';
import { loginValidation } from '@/constant/initialValue';
import LoadingOverlay from '@/components/loading';
import { login } from '@/api';
import { useAuth } from '@/utils';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { showResponseModal } from '@/components/response-alert';

const LoginPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Login'));
  });
  const router = useRouter();
  const { login: loginContext } = useAuth();
  const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
  const [loading, setLoading] = useState<boolean>(false);

  const { handleChange, handleSubmit, values, errors, isValid, resetForm } = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await login(values);
        if (response?.data?.length === 0) {
          return showResponseModal(false, 'Login Failed');
        }
        showResponseModal(true, 'Log In Successfully');
        const req = response?.data[0];
        const userData = {
          user_id: req?.id,
          username: req?.username,
          user_type: req?.user_type,
          email: req?.email,
          fullname: req?.fullname,
        };
        loginContext(userData);
        router?.push('/');
      } catch (err: any) {
        showResponseModal(false, 'Login Failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Fragment>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
          <h2 className="mb-3 text-2xl font-bold">Sign In</h2>
          <p className="mb-7">Enter your email and password to login</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input id="username" type="username" className="form-input" placeholder="Enter Username" name="username" onChange={handleChange} value={values?.username} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="Enter Password" name="password" onChange={handleChange} value={values?.password} />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              SIGN IN
            </button>
          </form>
          <p className="py-5 text-center">
            Dont&apos;t have an account ?
            <Link href="/auth/register" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {loading && <LoadingOverlay />}
    </Fragment>
  );
};
LoginPage.getLayout = (page: any) => {
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
    props: {}, // will be passed to the page component as props
  };
};
export default LoginPage;
