import React, { Fragment } from 'react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import UseSubsciptionPassangers from '@/api/task';
import LoadingOverlay from '@/components/loading';
import { statusClassMap } from '@/constant/initialValue';
import Dropdown from '@/components/Dropdown';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { TaskRecord } from '@/types/task';

export default function CompletedTaskWorkflow() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Medical Checkup Workflow'));
  });
  const { user } = useAuth();
  const status = ['Completed', 'Rejected'];
  const { dataTask, errorTask, loadingTask } = UseSubsciptionPassangers(status, user?.user_id);
  const router = useRouter();

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

  return (
    <Fragment>
      <section>
        <h2 className="text-2xl font-bold text-gray-700">History Proses Radiolog</h2>
      </section>

      <section className="py-5">
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
                {
                  accessor: 'action',
                  render: (record, index) => {
                    return (
                      <div className="dropdown">
                        <Dropdown
                          offset={[0, 5]}
                          placement={`${'top-end'}`}
                          button={
                            <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                              <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          }
                        >
                          <ul>
                            <li>
                              <button type="button">Download</button>
                            </li>
                            <li>
                              <button type="button" onClick={() => router.push(`/users/views/${record?.task_id}`)}>
                                View Detail
                              </button>
                            </li>
                          </ul>
                        </Dropdown>
                      </div>
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
      {loadingTask && <LoadingOverlay />}
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
