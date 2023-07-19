import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import uploadFileToBase64 from "../../../libs/uploadFileToBase64";
import { ParentOrganizationServices } from '../../../services'


function InputMainOrganization() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [fileName, setFileName] = useState({});
    const [send, setSend] = useState({});

    let history = useHistory();

    const handleCreateData = async () => {
        console.log(formData)
        let { message } = await ParentOrganizationServices.add(formData);
        console.log(message)
        history.push('/main-organization')
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        console.log(event)
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            handleCreateData()
            event.preventDefault();
        }
      };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId='noInduk'>
                    <Form.Label column sm={2}>
                      No. Induk 
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, parent_no: e.target.value})
                        }} required type='text' pattern='[0-9]*' placeholder="Masukkan Nomor Induk" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan No. Induk
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="namaInduk">
                    <Form.Label column sm={2}>
                    Nama Induk
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, parent_name: e.target.value})
                        }} required name='namaInduk' type="text" placeholder="Masukkan Nama Rumah Sehat" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Nama Induk
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="pilihKomisi">
                    <Form.Label column sm={2}>
                    Pilih Komisi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, pilih_komisi: e.target.value})
                        }} as="select" custom placeholder="Pilih Komisi">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="fileADRT">
                    <Form.Label column sm={2}>
                        AD/RT
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, fileADRT: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, ad_rt: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                        {fileName.fileADRT ? fileName.fileADRT : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="aktaNotarif">
                    <Form.Label column sm={2}>
                        Akta Notarif
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, aktaNotarif: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, notarial_deed: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                        {fileName.aktaNotarif ? fileName.aktaNotarif : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="sk">
                    <Form.Label column sm={2}>
                        SK KUMHAM
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, sk: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, sk_kumham: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                        {fileName.sk ? fileName.sk : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="susunanPengurus">
                    <Form.Label column sm={2}>
                        Susunan Pengurus
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, susunanPengurus: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, board_of_management: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                        {fileName.susunanPengurus ? fileName.susunanPengurus : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="npwp">
                    <Form.Label column sm={2}>
                        NPWP
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, npwp: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, npwp: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                            {fileName.npwp ? fileName.npwp : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId='noRek'>
                    <Form.Label column sm={2}>
                      Nomor Rekening
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control required type='text' pattern='[0-9]*' placeholder="Masukkan Nomor Rekening"  onChange={(e) => {
                            setFormData({...formData, bank_account_no: e.target.value})
                        }} />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Nomor Rekening
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="proInduk">
                    <Form.Label column sm={2}>
                        8 Induk Provinsi
                    </Form.Label>
                    <Col sm={10}>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input accept='application/pdf' required type='isInvalid' onChange={ async (e) => {
                            setFileName({...fileName, proInduk: e.target.files[0].name})
                            // const base64 = await uploadFileToBase64(e.target.files)
                            setFormData({...formData, main_province: e.target.files[0]})
                        }} />
                        <Form.File.Label data-browse="Upload">
                            {fileName.proInduk ? fileName.proInduk : "Upload file pdf"}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">Mohon masukkan file pdf</Form.Control.Feedback>
                    </Form.File>
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan File pdf
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 6 }}>
                        <Button onClick={() => history.push('/main-organization')} className='mr-5' variant='secondary' >Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default InputMainOrganization
