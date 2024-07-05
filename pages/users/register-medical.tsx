import React, { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import UseSubsciptionPassangers, { usePostTask } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import Modal from '@/components/modal';
import { useModal } from '@/hooks/use-modal';
import { useFormik } from 'formik';
import Select from 'react-select';
import { showResponseModal } from '@/components/response-alert';
import { options, regisValidation, statusClassMap } from '@/constant/initialValue';
import { isNull } from 'lodash';
import { useAuth } from '@/utils';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { TaskRecord } from '@/types/task';

export default function RegisterMedicalCheckup() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Registrasi Pasien'));
  });

  const { user } = useAuth();
  const status = ['Completed', 'Rejected', 'In Progress', 'Pending', 'Approved'];

  const { dataTask, errorTask, loadingTask } = UseSubsciptionPassangers(status, user?.user_id);
  const { postTasks, error, loading } = usePostTask();
  const [modalState, showModal, hideModal] = useModal();

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

  const { setFieldValue, handleSubmit, resetForm, isValid, errors, values } = useFormik({
    initialValues: {
      type: null,
      user_id: user?.user_id,
    },
    onSubmit: (values) => {
      const payload = {
        ...values,
        flows: [
          {
            time: new Date(),
            createdBy: user?.fullname,
            description: 'Created Task',
          },
        ],
        created_by: user?.fullname,
      };
      try {
        postTasks({
          variables: {
            objects: payload,
          },
        }).then(() => {
          showResponseModal(true, 'success');
          setTimeout(() => {
            hideModal();
            resetForm();
          }, 500);
        });
      } catch (error) {
        showResponseModal(false, 'error');
      }
    },
    validationSchema: regisValidation,
  });

  const isShowRegister = dataTask?.data?.some((item: any) => ['Pending', 'In Progress'].includes(item?.status));

  return (
    <Fragment>
      <section>
        <h2 className="text-2xl font-bold text-gray-700">Pendaftaran Radiologi</h2>
      </section>
      <section className="flex justify-end py-3">
        {!isShowRegister && (
          <button type="button" className="btn btn-primary" onClick={() => showModal({ title: 'Pendaftaran Radiologi' })}>
            Registrasi
          </button>
        )}
      </section>
      <section>
        <div className="panel">
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Data History</h5>
          <div className="datatables">
            <DataTable
              noRecordsText="No results match your search query"
              highlightOnHover
              className="table-hover whitespace-nowrap"
              records={recordsData as TaskRecord[]}
              columns={[
                { accessor: 'task_id', title: 'Task ID' },
                { accessor: 'type', title: 'Task Type' },
                { accessor: 'user.fullname', title: 'Name' },
                { accessor: 'created_by' },
                {
                  accessor: 'status',
                  render: (record) => {
                    return <span className={`badge whitespace-nowrap ${statusClassMap[record?.status as keyof typeof statusClassMap] || 'bg-primary'}`}>{record?.status}</span>;
                  },
                },
                {
                  accessor: 'approved_by',
                  render: (record, index) => {
                    return <span>{record?.approved_by || '-'}</span>;
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
      {loadingTask && <LoadingOverlay />}

      {/* modal */}
      <Modal open={modalState.open} onClose={hideModal} onConfirm={handleSubmit} title={modalState.title} onLoadingAction={loading} disableAction={loading || !isValid || isNull(values.type)}>
        <form className="space-y-5 pb-10 pt-2">
          <div>
            <label htmlFor="type">Tipe Rekam Medis</label>

            <Select
              id="type"
              className="overflow-visible"
              placeholder="Pilih tipe"
              options={options}
              name="type"
              onChange={(e) => {
                setFieldValue('type', e?.value);
              }}
            />
            {errors.type && <div className="mt-1 text-danger">{errors.type}</div>}
          </div>
          {/* <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="Enter Password" name="password" onChange={handleChange} value={values?.password} />
            </div> */}
        </form>
      </Modal>
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
