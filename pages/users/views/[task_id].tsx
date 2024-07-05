import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { UseSubsciptionPassangersWithId } from '@/api/task';
import LoadingOverlay from '@/components/loading';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useAuth } from '@/utils';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { isUndefined } from 'lodash';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import Link from 'next/link';
import parse from 'html-react-parser';

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

  const [isOpen, setIsOpen] = useState<any>(false);

  const handleSvgsType = (status: string) => {
    if (status === 'Created Task') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-white shadow shadow-warning">
          <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      );
    } else if (status === 'Approved Task') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white shadow-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.5"
              d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    } else if (status === 'Completed') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M4 12.9L7.14286 16.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.0002 7.5625L11.4286 16.5625L11.0002 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else if (status === 'Rejected') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0607 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z"
              fill="#fff"
            />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info text-white shadow shadow-info">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.71275 10.6736C7.16723 8.15492 9.38539 6.25 12.0437 6.25C13.6212 6.25 15.0431 6.9209 16.0328 7.9907C16.3141 8.29476 16.2956 8.76927 15.9915 9.05055C15.6875 9.33183 15.213 9.31337 14.9317 9.0093C14.2154 8.23504 13.1879 7.75 12.0437 7.75C10.2056 7.75 8.66974 9.00212 8.24452 10.6853L8.48095 10.4586C8.77994 10.172 9.25471 10.182 9.54137 10.4809C9.82804 10.7799 9.81805 11.2547 9.51905 11.5414L7.89662 13.0969C7.74932 13.2381 7.55084 13.3133 7.34695 13.3049C7.14306 13.2966 6.95137 13.2056 6.81608 13.0528L5.43852 11.4972C5.16391 11.1871 5.19267 10.7131 5.50277 10.4385C5.81286 10.1639 6.28686 10.1927 6.56148 10.5028L6.71275 10.6736Z"
              fill="#FFFFFF"
            />
            <path
              d="M16.6485 10.6959C16.8523 10.704 17.044 10.7947 17.1795 10.9472L18.5607 12.5019C18.8358 12.8115 18.8078 13.2856 18.4981 13.5607C18.1885 13.8358 17.7144 13.8078 17.4393 13.4981L17.2841 13.3234C16.8295 15.8458 14.6011 17.7509 11.9348 17.7509C10.3635 17.7509 8.94543 17.0895 7.95312 16.0322C7.66966 15.7302 7.68472 15.2555 7.98675 14.9721C8.28879 14.6886 8.76342 14.7037 9.04688 15.0057C9.76546 15.7714 10.792 16.2509 11.9348 16.2509C13.7819 16.2509 15.322 14.9991 15.7503 13.3193L15.5195 13.5409C15.2208 13.8278 14.746 13.8183 14.4591 13.5195C14.1721 13.2208 14.1817 12.746 14.4805 12.4591L16.0993 10.9044C16.2464 10.7631 16.4447 10.6878 16.6485 10.6959Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );
    }
  };

  return (
    <Fragment>
      <section>
        <h2 className="text-2xl font-bold text-gray-700">Pendaftaran Radiologi</h2>
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
            {errorTask && <h1 className="text-center text-2xl">{errorTask?.message}</h1>}
            <div className="space-y-7">
              {dataTask &&
                dataTask?.data[0]?.flows?.map((item: any, index: number) => (
                  <div className="flex" key={index}>
                    <div
                      className={`relative z-10 ${
                        index !== dataTask?.data[0]?.flows.length - 1 ? 'before:absolute before:left-4 before:top-10 before:h-[calc(100%-24px)] before:w-[2px] before:bg-white-dark/30' : ''
                      } ltr:mr-2 rtl:ml-2`}
                    >
                      {handleSvgsType(item?.description)}
                    </div>
                    <div>
                      {/* content */}
                      <h5 className="font-semibold dark:text-white-light">{item?.description}</h5>
                      <p className="text-xs text-white-dark">{dayjs(item?.time).format('D MMM, YYYY')}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-10">
              {dataTask?.data?.map((item: any, index: number) => {
                return (
                  <>
                    <h1 className="text-2xl font-bold">Preview</h1>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Link
                          href="#"
                          key={index}
                          className={``}
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        >
                          {item?.images_rel?.images && (
                            <img src={item?.images_rel?.images} alt="gallery" data-fancybox="gallery" className="h-full w-full rounded-sm object-cover" data-caption={item.title} />
                          )}
                        </Link>
                      </div>
                      {item?.images_rel?.description && <div className="col-span-1 border p-4">{parse(item?.images_rel?.description)}</div>}
                    </div>
                  </>
                );
              })}
              {isOpen && (
                <Lightbox
                  mainSrc={`${dataTask?.data[0]?.images_rel?.images}`}
                  // nextSrc={`${getItems[photoIndex + (1 % getItems.length)]?.src}`}
                  // prevSrc={getItems[(photoIndex + getItems.length - 1) % getItems.length]?.src}
                  onCloseRequest={() => setIsOpen(false)}
                  // onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % getItems.length)}
                  // onMovePrevRequest={() => setPhotoIndex((photoIndex + getItems.length - 1) % getItems.length)}
                  enableZoom={true}
                />
              )}
            </div>
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
