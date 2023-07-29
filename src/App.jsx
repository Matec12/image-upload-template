import { useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { _uploadImage, useImageUpload } from './api/image';

function App() {
  const { imageUploadMutation } = useImageUpload();

  const formik = useFormik({
    initialValues: {
      files: []
    },
    onSubmit: (data) => {
      const formData = new FormData();
      data?.files.forEach((file) => formData.append('files', file));
      imageUploadMutation.mutate(formData);
    }
  });

  const { values, setFieldValue, handleSubmit } = formik;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFieldValue(
        'files',
        acceptedFiles.map((file) => Object.assign(file))
      );
    }
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          className="h-10 w-10"
          alt={file.name}
          src={URL.createObjectURL(file)}
        />
      );
    } else {
      return <Icon icon="tabler:file-description" className="w-8" />;
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = values?.files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFieldValue('files', [...filtered]);
  };

  const handleRemoveAllFiles = () => {
    setFieldValue('files', []);
  };

  const fileList = values.files.map((file) => (
    <li
      key={file.name}
      className="mt-3 flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3"
    >
      <div className="file-details flex items-center">
        <div className="file-preview mr-3 flex">{renderFilePreview(file)}</div>
        <div>
          <p className="font-semibold">{file.name}</p>
          <p className="file-size">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </p>
        </div>
      </div>
      <button className="rounded-full" onClick={() => handleRemoveFile(file)}>
        <Icon icon="tabler:x" fontSize={20} />
      </button>
    </li>
  ));

  return (
    <div className="py-20">
      <h1 className="text-center text-lg font-bold uppercase mb-4">
        Image Upload
      </h1>
      <div className="flex w-full container mx-auto px-12 justify-center items-center">
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit}>
            <div
              {...getRootProps({ className: 'dropzone' })}
              className="flex w-full cursor-pointer justify-center border border-dashed border-gray-300 p-8 rounded-md shadow-lg"
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center text-center">
                <Icon icon="lucide:upload" className="mb-4 w-6 fill-primary" />
                <p className="mb-5 text-sm">
                  <span className="text-sm text-primary">Click to upload </span>
                  or drag and drop
                </p>
              </div>
            </div>
            {values?.files.length ? (
              <>
                <ul>{fileList}</ul>
                <div className="mt-3 flex justify-end">
                  <button
                    className="border rounded-full py-2 px-3 text-sm"
                    onClick={handleRemoveAllFiles}
                  >
                    Remove All
                  </button>
                </div>
              </>
            ) : null}
            <button
              type="submit"
              className="bg-black text-white w-full mt-3 py-3 rounded-md"
            >
              Upload
            </button>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}

export default App;
