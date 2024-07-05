import React, { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useUpdateTask } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import Modal, { ModalProps } from '@/components/modal';
import { useModal } from '@/hooks/use-modal';
import Select from 'react-select';
import Swal from 'sweetalert2';

import ResponseModal, { ModalConfirmProps } from '@/components/respon-modal';
import { get, includes, isEmpty } from 'lodash';
import { useFormik } from 'formik';
import { YupValidation } from '@/constant/initialValue';
import { useAuth } from '@/utils';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { TaskRecord } from '@/types/task';
import { useDeleteDoctor, useGetDoctor, useRegister } from '@/api';
import { showResponseModal } from '@/components/response-alert';
import { useRouter } from 'next/router';

export interface TaskRecordNew extends TaskRecord {
  id: string;
}

export default function ManageDoctorDatas() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(setPageTitle('Manage Doctor'));
  });
  const { user } = useAuth();
  const status = ['dokter-poli', 'dokter-radiologi'];
  const { dataTask, errorTask, loadingTask } = useGetDoctor(status);
  const { register, error, loading } = useRegister();

  const { updateThisTask, loadingUpdate, errorUpdate } = useUpdateTask();
  const { deletes, error: errorDel, loading: loadingDel } = useDeleteDoctor();
  const [modalState, showModal, hideModal, confirmModal] = useModal<ModalProps>();
  const [confirmModalState, showModalRespon, hideModalRespon] = useModal<ModalConfirmProps>();

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = dataTask?.data?.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(dataTask?.data?.slice(from, to));
  }, [page, pageSize, dataTask]);

  const { handleChange, handleSubmit, resetForm, errors, values, setFieldValue } = useFormik({
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
        const response = await register({
          variables: { objects: values },
        });
        showResponseModal(true, 'Registration Successful');
        if (response) {
          hideModal();
          setTimeout(() => {
            router.push('/admin/manage-pasien');
          }, 500);
        }
        resetForm();
      } catch (err: any) {
        const message = get(err, 'message');
        showResponseModal(false, includes('field', message) ? 'Invalid field input' : err?.message);
      }
    },
  });

  const showAlert = async (id: string) => {
    Swal.fire({
      icon: 'warning',
      title: 'Delete Action?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Delete',
      padding: '2em',
      reverseButtons: true,
      customClass: 'sweet-alerts',
    }).then((result) => {
      if (result.value) {
        deletes({
          variables: {
            id: id,
          },
        })
          .then(() => {
            Swal.fire({ title: 'Deleted!', text: 'Data has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
          })
          .catch((err) => {
            Swal.fire({ title: 'Failed!', text: `${err?.message}`, icon: 'error', customClass: 'sweet-alerts' });
          });
      }
    });
  };

  return (
    <Fragment>
      <section className="pb-5">
        <h2 className="text-2xl font-bold text-gray-700">Manage Doctor</h2>
      </section>

      <section>
        <div className="panel">
          <div className="flex items-center justify-between py-3">
            <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Data Task</h5>
            <button type="button" className="btn btn-primary" onClick={() => showModal({ title: 'Tambah Dokter' })}>
              Registrasi
            </button>
          </div>
          <div className="datatables">
            <DataTable
              noRecordsText="No results match your search query"
              highlightOnHover
              className="table-hover whitespace-nowrap"
              records={recordsData as TaskRecordNew[]}
              columns={[
                { accessor: 'id', title: 'Task ID' },
                { accessor: 'fullname', title: 'Name' },
                { accessor: 'username' },
                { accessor: 'email' },
                {
                  accessor: 'user_type',
                  title: 'Type',
                },
                {
                  accessor: 'action',
                  render: (record) => {
                    return (
                      <ul className="flex items-center justify-center gap-2">
                        <li>
                          <button type="button" onClick={() => router.push(`/admin/edit/${record?.id}`)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-primary ltr:mr-2 rtl:ml-2">
                              <path
                                d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                opacity="0.5"
                                d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              showAlert(record?.id);
                            }}
                          >
                            <svg className="text-danger" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                opacity="0.5"
                                d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <path
                                d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    );
                  },
                },
              ]}
              totalRecords={dataTask?.data?.length}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              minHeight={200}
              paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
            />
          </div>
        </div>
      </section>
      {/* loading */}
      {(loadingTask || loadingUpdate || loading || loadingDel) && <LoadingOverlay />}

      {/* modal */}
      <Modal open={modalState.open} onClose={hideModal} onConfirm={handleSubmit} title={modalState.title}>
        <form className="space-y-5 pt-5">
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
            <input id="username" type="text" className="form-input" placeholder="Fill Username" name="username" onChange={handleChange} value={values.username} />
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
              id="type"
              className="overflow-visible"
              placeholder="Pilih tipe"
              options={[
                {
                  label: 'Dokter Poli',
                  value: 'dokter-poli',
                },
                {
                  label: 'Dokter Radiologi',
                  value: 'dokter-radiologi',
                },
              ]}
              name="type"
              onChange={(e) => {
                setFieldValue('user_type', e?.value);
              }}
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
      </Modal>

      <ResponseModal {...confirmModalState} />
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
    props: {}, // will be passed to the page component as props
  };
};
