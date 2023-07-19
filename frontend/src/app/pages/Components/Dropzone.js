import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    transition: 'border .3s ease-in-out',
    cursor: 'pointer'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


function Dropzone(props) {
    const [sizeRejected, setSizeRejected] = useState(false);
    const [typeRejected, setTypeRejected] = useState(false);
    const [tooMany, setTooMany] = useState(false);
    const [fileEmpty, setFileEmpty] = useState(false);
    const [file, setFile] = useState({});
    
    const onDrop = useCallback(acceptedFiles => {
        // console.log(acceptedFiles);
        setFile(acceptedFiles[0]);
        setTypeRejected(false);
        setSizeRejected(false);
        setTooMany(false);
        setFileEmpty(false)
    }, []);

    const onDropRejected = useCallback(rejectedFiles => {
    //   console.log(rejectedFiles);
    //   console.log(rejectedFiles[0].errors[0].code);
      let errorsCode = rejectedFiles[0].errors[0].code;
      if (errorsCode == 'file-invalid-type') {
        setTypeRejected(true)
        setSizeRejected(false)
        setTooMany(false)
        setFileEmpty(false)
      }
      if (errorsCode == 'file-too-large') {
        setSizeRejected(true)
        setTypeRejected(false)
        setTooMany(false)
        setFileEmpty(false)
      }
      if (errorsCode == 'too-many-files') {
        setTooMany(true)
        setSizeRejected(false)
        setTypeRejected(false)
        setFileEmpty(false)
      }
    }, []);

    const handleFile = () => {
        if (Object.keys(file).length == 0) {
            setFileEmpty(true)
            return
        } 
        const formData = {
            file: file
        }
        props.data(formData);
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        onDropRejected,
        accept: '.xlsx, .xls',
        maxSize: '64000000',
        maxFiles: 1,
    });

    const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    }), [
    isDragActive,
    ]);

    return (
      <div>
        {
          file !== undefined && Object.keys(file).length > 0 ? (
            <div {...getRootProps({style})}>
              <input {...getInputProps()} />
              <i style={{fontSize: '50px'}} class="far fa-file-excel"></i>
              <br/>
              <div style={{color: '#495057', fontSize: '19px'}}>{file.path} - {formatBytes(file.size)}</div>
            </div>
          ) : (
            <div {...getRootProps({style})}>
              <input {...getInputProps()} />
              <i style={{fontSize: '50px'}} class="fas fa-cloud-upload-alt"></i>
              <br/>
              <div style={{color: '#495057', fontSize: '19px'}}>Tarik file di sini atau tekan untuk pilih file</div>
            </div>
          )
        }
        {
          sizeRejected ? (
            <div
              className="invalid-feedback"
              style={{display: 'block'}}
            >
              Ukuran file tidak boleh lebih dari 64 MB
            </div>
  
          ) : typeRejected ? (
            <div
              className="invalid-feedback"
              style={{display: 'block'}}
            >
              Tipe file tidak sesuai
            </div>
  
          ) : tooMany ? (
            <div
              className="invalid-feedback"
              style={{display: 'block'}}
            >
              Jumlah item maksimal 1 file
            </div>
  
          ) : fileEmpty ? (
            <div
              className="invalid-feedback"
              style={{display: 'block'}}
            >
              Silakan pilih file terlebih dahulu
            </div>
  
          ) : ""
        }
        <div className="d-flex justify-content-center mt-4">
            <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleFile}
            >
                Unggah
            </button>
        </div>
      </div>
    )
}

export default Dropzone;