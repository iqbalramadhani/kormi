import React, { useEffect, useState } from "react";
import Dropzone from '../Components/Dropzone'
import { Button } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import { UserServices } from "../../services";
import Swal from 'sweetalert2'
import mailIcon from '../../../icons/ic_mail.svg';
import ShowAlert from '../../libs/ShowAlert';
import { useHistory } from "react-router-dom";


export function UploadMember(props) {

  useEffect(() => {}, []);
  const history = useHistory();

  const handleSubmit = async (formData) => {
    // console.log(formData);
    const { data: {message_error, message_success} } = await UserServices.import(formData);
    if (message_success.length > 0) {
      Swal.fire({
        title: 'Unggah Data Berhasil',
        text: 'Selamat, data anggota induk sudah ke sistem',
        imageUrl: mailIcon,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: 'Cek Halaman Anggota',
        confirmButtonColor: '#34C38F',
      }).then(result => {
        if (result.value) {
          history.push('/member')
        }
      })
    }
    if (message_error.length > 0) {
      let error = [];
      message_error.map((err, i) => {
        error.push(`<div style="line-height: 20px">(${i+1}.) ${err.subject.replace("()", "") ?? ""} : ${err.text ?? ""}</div><br>`);
      });
      let content = error.join(" ");
      Swal.fire({
        title: 'Sebagian Unggahan Gagal',
        html: `
        <div align="left" style="line-height: 12px">
          <div>Error pada row:</div><br>
          ${content}
        </div>`,
        icon: 'error',
        showCancelButton: true,
      })
    }
  }

  const handleTemplate = async () => {
    const { message, data } = await UserServices.downloadTemplate();
    if (message == 'Sukses') { 
      window.open(data.link_download, '_blank');
    }
  }

  return (
    <Card>
      <CardHeader title="Unggah Data Anggota">
      </CardHeader>
      <CardBody>
        <p>
        Silahkan unggah data anggota Induk dengan menggunakan format file Excel anda. Atribut data yang akan kami masukkan ke sistem adalah nama, alamat email, nomor telepon, dan status anggota
        </p>
        <p>
        Silahkan pilih file dengan format tabel (<b>.xls</b> atau <b>.xlsx</b>) untuk diunggah, kemudian tekan unggah file dan kemudian import
        </p>
        <p>
        Plilih file dari komputer: (<b>Ukuran maksimal: 64 MB</b>)
        </p>
        <div className="d-flex" style={{alignItems: 'baseline'}}>
          <p>
            Gunakan format template yang sudah kami sediakan
          </p>
          <button type="submit" className="btn btn-unduh ml-10 mb-2" onClick={handleTemplate}>Unduh Template</button>
        </div>
        <Dropzone data={handleSubmit}/>
      </CardBody>
    </Card>    
  );
}

export default UploadMember;
