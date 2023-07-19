import React, {useState} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { CommissionServices } from '../../../services'


function InputCommission() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});


    let history = useHistory();

    const handleCreateData = async () => {
        let { message } = await CommissionServices.add(formData);
        console.log(message)
        history.push('/commission')
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
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
                <Form.Group as={Row} controlId='nomorKomisi'>
                    <Form.Label column sm={2}>
                      Nomor Komisi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, commission_no: e.target.value})
                        }} required type='text' pattern='[0-9]*' placeholder="Masukkan Nomor Komisi" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Nomor Komisi
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId='kodeKomisi'>
                    <Form.Label column sm={2}>
                      Kode Komisi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, commission_code: e.target.value})
                        }} required type='text' pattern='[0-9]*' placeholder="Masukkan Kode Komisi" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Kode Komisi
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="namaKomisi">
                    <Form.Label column sm={2}>
                    Nama Komis
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, commission_name: e.target.value})
                        }} required name='namaKomisi' type="text" placeholder="Masukkan Nama Komisi" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Nama Komisi
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 6 }}>
                        <Button onClick={() => history.push('/commission')} className='mr-5' variant='secondary' >Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    )
}

export default InputCommission
