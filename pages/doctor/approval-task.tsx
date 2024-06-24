import React, { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import UseSubsciptionPassangers, { useUpdateTask } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import Modal, { ModalProps } from '@/components/modal';
import { useModal } from '@/hooks/use-modal';
import { statusClassMap } from '@/constant/initialValue';
import ResponseModal, { ModalConfirmProps } from '@/components/respon-modal';
import { useAuth } from '@/utils';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { TaskRecord } from '@/types/task';

export default function ApprovalPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Approval pasien'));
  });
  const { user } = useAuth();

  const { dataTask, errorTask, loadingTask } = UseSubsciptionPassangers(['Pending']);
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

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(dataTask?.data?.slice(from, to));
  }, [page, pageSize, dataTask]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    hideModal();
    const existingFlows = modalState?.values?.flows;
    const newStep = {
      time: new Date(),
      createdBy: user?.fullname,
      description: 'Approved Task',
    };
    const newFlows = [...existingFlows, newStep];

    try {
      const res = await updateThisTask({
        variables: {
          set: {
            status: modalState?.values?.action,
            next_step: 'Administrasi',
            approved_by: user?.fullname,
            flows: newFlows,
          },
          task_id: modalState?.values?.task_id,
        },
      });
      showModalRespon({
        variant: 'success',
        title: `Success Approve ${modalState?.values?.task_id}`,
      });
    } catch (error: any) {
      showModalRespon({
        variant: 'error',
        title: 'Error when Update task',
        description: error?.message || 'Internal Server Error',
      });
    }
  };

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
                  accessor: 'action',
                  render: (record) => {
                    return (
                      <ul className="flex items-center justify-center gap-2">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              showModal({ title: 'Approve Action', values: { ...record, action: 'Approved' } });
                            }}
                          >
                            <svg className="text-success" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              showModal({ title: 'Reject Action', values: { ...record, action: 'Rejected' } });
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger">
                              <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      {(loadingTask || loadingUpdate) && <LoadingOverlay />}

      {/* modal */}
      {/* @ts-ignore */}
      <Modal open={modalState.open} onClose={hideModal} onConfirm={handleSubmit} title={modalState.title}>
        <div className="grid grid-cols-3 gap-y-3">
          <span className="col-span-1 font-bold text-black">Task ID</span>
          <span className="col-span-2">{modalState?.values?.task_id}</span>
          <span className="col-span-1 font-bold text-black">Type</span>
          <span className="col-span-2">{modalState?.values?.type}</span>
          <span className="col-span-1 font-bold text-black">Created By</span>
          <span className="col-span-2">{modalState?.values?.created_by || 'Pasien'}</span>
        </div>
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
