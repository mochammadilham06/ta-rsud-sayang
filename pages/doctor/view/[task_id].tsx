import { useGetImagesById, useUpdatePost } from '@/api';
import LoadingOverlay from '@/components/loading';
import { setPageTitle } from '@/store/themeConfigSlice';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Lightbox from 'react-18-image-lightbox';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { showResponseModal } from '@/components/response-alert';
import Button from '@/components/button';

import 'react-18-image-lightbox/style.css';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ViewDetailDiagnoses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const task_id = router?.query?.task_id;
  useEffect(() => {
    dispatch(setPageTitle('Upload File'));
  });
  const { dataTask, errorTask, loadingTask } = useGetImagesById(task_id);
  const { error, loading, postImage } = useUpdatePost();

  console.log({ dataTask });
  const [form, setForm] = useState<any>(dataTask?.data[0]?.description || '');
  const idImages = dataTask?.data ? dataTask?.data[0]?.id : '';

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await postImage({
        variables: {
          id: idImages,
          description: form,
        },
      }).then(() => {
        showResponseModal(true, 'success');
        router.back();
      });
    } catch (error: any) {
      showResponseModal(false, error?.message);
    }
  };
  return (
    <Fragment>
      <div className="panel" id="single_file">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Single File Upload</h5>
        </div>
        <div className="mb-5">
          <div className="custom-file-container" data-upload-id="myFirstImage">
            <div className="label-container">
              <label>Result</label>
            </div>
            {errorTask && <h1 className="text-2xl">{errorTask?.message}</h1>}
            {dataTask &&
              dataTask?.data?.map((image: any, index: number) => (
                <Link
                  href="#"
                  key={index}
                  className={``}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <img src={image?.images} alt="gallery" data-fancybox="gallery" className="m-auto" data-caption={image?.description} />
                </Link>
              ))}
            {dataTask?.data?.length === 0 ? <img src="/assets/images/file-preview.svg" className="m-auto w-full max-w-md" alt="" /> : undefined}
            {isOpen && <Lightbox mainSrc={`${dataTask?.data[0]?.images}`} onCloseRequest={() => setIsOpen(false)} enableZoom={true} />}
            <div className="pt-10">
              <label htmlFor="description">Description</label>
              <ReactQuill theme="snow" value={form} onChange={setForm} />
            </div>

            <div className="flex justify-end py-5">
              {/* @ts-ignore */}
              <Button onAction={handleSubmit} title="Submit" variant="primary" />
            </div>
          </div>
        </div>
      </div>

      {(loadingTask || loading) && <LoadingOverlay />}
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
    props: {},
  };
};
