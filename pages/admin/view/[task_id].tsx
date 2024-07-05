import { useGetImagesById, usePostImage } from '@/api';
import Button from '@/components/button';
import LoadingOverlay from '@/components/loading';
import { showResponseModal } from '@/components/response-alert';
import { storage } from '@/config/firebase';
import { setPageTitle } from '@/store/themeConfigSlice';
import { getCookie } from 'cookies-next';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { size } from 'lodash';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { FormEvent, Fragment } from 'react';
import { useEffect, useState } from 'react';
// import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useDispatch } from 'react-redux';

export default function UploadResults() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { error, loading, postImage } = usePostImage();
  const { dataTask, errorTask, loadingTask } = useGetImagesById(router?.query?.task_id);

  const task_id = router?.query?.task_id;
  useEffect(() => {
    dispatch(setPageTitle('Upload File'));
  });

  const [images, setImages] = useState<any>([]);
  const maxNumber = 69;

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    if (!imageList) return;

    const { file } = imageList[0];
    const filename = file?.name;
    const storageRef = ref(storage, `medical-checkup/${filename}-${task_id}`);
    const uploadTask = uploadBytesResumable(storageRef, imageList[0]?.file as File);

    setUploading(true);
    uploadTask.on('state_changed', async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        setImages(imageList as never[]);
      } catch (error) {
      } finally {
        setUploading(false);
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await postImage({
        variables: {
          objects: {
            task_id,
            images: imageUrl,
            // description: form,
          },
        },
      }).then(() => {
        showResponseModal(true, 'success');
        setImages([]);
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
              <label>Upload </label>
              <button
                type="button"
                className="custom-file-container__image-clear"
                title="Clear Image"
                onClick={() => {
                  setImages([]);
                }}
              >
                ×
              </button>
            </div>
            <label className="custom-file-container__custom-file"></label>
            <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
            <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
            <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
              {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                <div className="upload__image-wrapper">
                  {!imageList ||
                    (size(dataTask?.data) === 0 && (
                      <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                        Choose File...
                      </button>
                    ))}
                  {imageList.map((image, index) => (
                    <div key={index} className="custom-file-container__image-preview relative">
                      <img src={image.dataURL} alt="img" className="m-auto" />
                    </div>
                  ))}
                  {size(dataTask?.data) > 0 && (
                    <div className="custom-file-container__image-preview relative">
                      <img src={dataTask?.data[0].images} alt="img" className="m-auto" />
                    </div>
                  )}
                </div>
              )}
            </ImageUploading>
            {images.length === 0 && size(dataTask?.data) === 0 ? <img src="/assets/images/file-preview.svg" className="m-auto w-full max-w-md" alt="" /> : ''}
            {/* <div>
              <label htmlFor="description">Description</label>
              <ReactQuill theme="snow" value={form} onChange={setForm} />
            </div> */}
          </div>
        </div>
      </div>

      {(uploading || loadingTask || loading) && <LoadingOverlay />}
      <div className="flex justify-end py-5">
        {/* @ts-ignore */}
        {images.length === 0 || (size(dataTask?.data) === 0 && <Button onAction={handleSubmit} title="Submit File" variant="primary" />)}
      </div>
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
