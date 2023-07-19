import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


function InputAdmin() {
    const [validated, setValidated] = useState(false);
    const [sk, setSk] = useState('');
    const [formData, setFormData] = useState({});

    let history = useHistory()

    const handleSK = (e) => {
        setSk(e.target.validity.valid ? e.target.value : sk)
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
            history.push('/admin')
        }
      };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
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

                <Form.Group as={Row} controlId='noSK'>
                    <Form.Label column sm={2}>
                      Nomor SK
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, noSK: e.target.value})
                        }} required type='text' onInput={handleSK} value={sk} pattern='[0-9]*' placeholder="Masukkan Nomor SK" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Nomor SK
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="deskripsiSK">
                    <Form.Label column sm={2}>
                    Deskripsi SK
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, desSK: e.target.value})
                        }} required name='namaInduk' type="text" placeholder="Masukkan Deskripsi" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Deskripsi SK
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="masaBakti">
                    <Form.Label column sm={2}>
                        Masa Bakti
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Control onChange={(e) => {
                        setFormData({...formData, masaBakti: e.target.value})
                    }} required type="date" placeholder="Masukkan Masa Bakti" />
                    <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Masa Bakti
                    </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 6 }}>
                        <Button onClick={() => {history.push('/admin')}} className='mr-5' variant='secondary' >Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    )
}

export default InputAdmin
