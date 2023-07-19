import React, {useState } from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
  
  
function InputMember() {
    const [validated, setValidated] = useState(false);
    const [number, setNumber] = useState('');
    const [pos, setPos] = useState('')
    const [formData, setFormData] = useState({});

    let history = useHistory();

    const handleNumber = (e) => {
        setNumber(e.target.validity.valid ? e.target.value : number)
    }

    const handlePos = (e) => {
        setPos(e.target.validity.valid ? e.target.value : pos)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        console.log(formData)
        if (form.checkValidity() === true){
            history.push('/member')
        }
      };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId='idAnggota'>
                    <Form.Label column sm={2}>
                      ID Anggota  
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, idAnggota: e.target.value})
                        }} required type='text' onInput={handleNumber} value={number} pattern='[0-9]*' placeholder="No Anggota" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan ID Anggota
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="nama">
                    <Form.Label column sm={2}>
                    Nama
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, nama: e.target.value})
                        }} required name='nama' type="text" placeholder="Masukan Nama" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Nama
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="alamat">
                    <Form.Label column sm={2}>
                    Alamat
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, alamat: e.target.value})
                        }} required type="text" placeholder="Masukkan Alamat" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Alamat
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="prov">
                    <Form.Label column sm={2}>
                        Provinsi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, prov: e.target.value})
                        }} as="select" custom placeholder="Pilih Propivinsi">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="kabKota">
                    <Form.Label column sm={2}>
                        Kota / Kabupaten
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, kabKota: e.target.value})
                        }} as="select" custom placeholder="Pilih Kabupaten">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="kodePos">
                    <Form.Label column sm={2}>
                        Kode Pos
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, kodePos: e.target.value})
                        }} onInput={handlePos} value={pos} type="text" pattern='[0-9]*' required placeholder="Masukan Kode Pos" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Kode Pos
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="tempatLahir">
                    <Form.Label column sm={2}>
                        Tempat Lahir
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, tempatLahir: e.target.value})
                        }} required type="text" placeholder="Tempat Lahir" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Tempat Lahir
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="tannggalLahir">
                    <Form.Label column sm={2}>
                        Tanggal Lahir
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, tanggalLahir: e.target.value})
                        }} required type="date" placeholder="Masukkan Tanggal Lahir" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Tanggal Lahir
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="pekerjaan">
                    <Form.Label column sm={2}>
                        Pekerjaan
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, pekerjaan: e.target.value})
                        }} required type="text" placeholder="Masukkan Pekerjaan" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Pekerjaan
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="email">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                            setFormData({...formData, email: e.target.value})
                        }} required type="email" placeholder="Masukkan Email" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Email
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 6 }}>
                        <Button onClick={() => {history.push('/member')}} className='mr-5' variant='secondary' >Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default InputMember
