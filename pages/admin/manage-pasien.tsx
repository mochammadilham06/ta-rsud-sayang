import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React from 'react';

export default function ManagePasiensData() {
  return <div>ManagePasiensData</div>;
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
    props: {}, // will be passed to the page component as props
  };
};
