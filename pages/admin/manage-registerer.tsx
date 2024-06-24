import React, { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import UseSubsciptionPassangers, { useUpdateTask } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import Modal, { ModalProps } from '@/components/modal';
import { useModal } from '@/hooks/use-modal';

import ResponseModal, { ModalConfirmProps } from '@/components/respon-modal';
import { isEmpty } from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { statusClassMap } from '@/constant/initialValue';
import { useAuth } from '@/utils';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { TaskRecord } from '@/types/task';

export interface TaskRecordNew extends TaskRecord {
  reason_progress?: string;
}

export default function ManageProcess() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Proses Medical Checkup'));
  });
  const { user } = useAuth();
  const status = ['Approved', 'In Progress', 'Completed'];
  const { dataTask, errorTask, loadingTask } = UseSubsciptionPassangers(status);
  const { updateThisTask, loadingUpdate, errorUpdate } = useUpdateTask();
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

  const YupValidationOnProgess = Yup.object().shape({
    // status: Yup.string().required('Please fill the password'),
    reason_progress: Yup.string().required('Please fill progress'),
  });

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(dataTask?.data?.slice(from, to));
  }, [page, pageSize, dataTask]);

  const { handleChange, handleSubmit, resetForm, errors, values, setFieldValue } = useFormik({
    initialValues: {
      status: '',
      reason_progress: '',
    },
    validationSchema: YupValidationOnProgess,
    onSubmit: async (values) => {
      const existingFlows = modalState?.values?.flows;
      const newStep = {
        time: new Date(),
        createdBy: user?.fullname,
        description: values?.reason_progress,
      };
      const newFlows = [...existingFlows, newStep];
      try {
        const res = await updateThisTask({
          variables: {
            set: {
              status: values?.status ? 'Completed' : 'In Progress',
              reason_progress: values?.status ? 'Completed' : values?.reason_progress,
              flows: newFlows,
            },
            task_id: modalState?.values?.task_id,
          },
        }).then(() => {
          hideModal();
          resetForm();
          showModalRespon({
            variant: 'success',
            title: `Success Approve ${modalState?.values?.task_id}`,
          });
        });
      } catch (error: any) {
        showModalRespon({
          variant: 'error',
          title: 'Error when Update task',
          description: error?.message || 'Internal Server Error',
        });
      }
    },
  });
  return (
    <Fragment>
      <section className="pb-5">
        <h2 className="text-2xl font-bold text-gray-700">Approval Pasien</h2>
      </section>

      <section>
        <div className="panel">
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Data Task</h5>
          <div className="datatables">
            <DataTable
              noRecordsText="No results match your search query"
              highlightOnHover
              className="table-hover whitespace-nowrap"
              records={recordsData as TaskRecordNew[]}
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
                  accessor: 'reason_progress',
                  render: (record) => {
                    return <span>{record?.reason_progress || '-'}</span>;
                  },
                },
                {
                  accessor: 'approved_by',
                  render: (record) => {
                    return <span>{record?.approved_by || '-'}</span>;
                  },
                },
                {
                  accessor: 'action',
                  render: (record) => {
                    return (
                      <ul className="flex items-center justify-center gap-2">
                        {!['Completed']?.includes(record?.status) && (
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                showModal({ title: 'Update Progress', values: { ...record, action: 'Approved' } });
                              }}
                            >
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
                        )}
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
      {(loadingTask || loadingUpdate) && <LoadingOverlay />}

      {/* modal */}
      <Modal open={modalState.open} onClose={hideModal} onConfirm={handleSubmit} title={modalState.title}>
        <div className="grid grid-cols-3 gap-y-3">
          <span className="col-span-1 font-bold text-black">Task ID</span>
          <span className="col-span-2">{modalState?.values?.task_id}</span>
          <span className="col-span-1 font-bold text-black">Approved By</span>
          <span className="col-span-2">{modalState?.values?.approved_by}</span>
          <span className="col-span-1 font-bold text-black">Type</span>
          <span className="col-span-2">{modalState?.values?.type}</span>
          <span className="col-span-1 font-bold text-black">Created By</span>
          <span className="col-span-2">{modalState?.values?.created_by || 'Pasien'}</span>
        </div>
        <form className="space-y-5 pt-5">
          <div className={!isEmpty(errors.reason_progress) ? 'has-error' : ''}>
            <label htmlFor="status" className="font-bold text-black">
              On Going Process
            </label>
            <input
              id="reason_progress"
              type="text"
              className="form-input"
              placeholder="Enter Progress"
              name="reason_progress"
              onChange={handleChange}
              value={values.reason_progress}
              disabled={values.status as any}
            />
            {errors.reason_progress && <div className="mt-1 text-danger">{errors.reason_progress}</div>}
          </div>
          <div>
            <label className="flex cursor-pointer items-center">
              <input
                name="status"
                type="checkbox"
                className="form-checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFieldValue('status', isChecked);
                  setFieldValue('reason_progress', isChecked ? 'Completed' : '');
                }}
              />
              <span className=" text-white-dark">Mark as Complete</span>
            </label>
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
