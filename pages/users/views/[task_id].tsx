import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { UseSubsciptionPassangersWithId } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useAuth } from '@/utils';

export interface TaskRecord {
  task_id: string;
  type: string;
  user: string;
  created_by: string;
  status: string;
  approved_by?: string;
}

export default function ViewDetailTask() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('View Detail Workflow'));
  });
  const router = useRouter();
  const task_id = router.query;
  const { user } = useAuth();
  const { dataTask, errorTask, loadingTask } = UseSubsciptionPassangersWithId(user?.user_id, task_id);

  const handleDownload = async () => {
    const url = dataTask?.data[0]?.images_rel?.images;
    window.open(url, '_blank');
  };

  return (
    <Fragment>
      <section>
        <h2 className="text-2xl font-bold text-gray-700">Pendaftaran Radiolog</h2>
      </section>

      <section className="flex justify-end py-3">
        {dataTask?.data[0]?.images_rel?.images && (
          <button className="btn btn-info" onClick={handleDownload}>
            Download
          </button>
        )}
      </section>
      <section className="py-5">
        <div className="panel">
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Data History</h5>
          <div className="mb-5">
            <div className="">
              {dataTask &&
                dataTask?.data[0]?.flows?.map((item: any, index: number) => (
                  <div className="flex" key={index}>
                    <p className="mr-5 min-w-[58px] max-w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">{dayjs(item?.time).format('YYYY-MM-DD')}</p>
                    <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                    <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                      <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">{item?.description}</p>
                      <p className="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">{item?.createdBy}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* loading */}
      {loadingTask && <LoadingOverlay />}
    </Fragment>
  );
}
