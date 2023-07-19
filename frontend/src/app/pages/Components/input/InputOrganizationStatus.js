import React, {useState} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import ShowAlert from '../../../libs/ShowAlert';
import { OrganizationStatusService } from '../../../services'

function InputOrganizationStatus() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    
    let history = useHistory();

    const handleCreateData = async () => {
        console.log(formData)
        let { message } = await OrganizationStatusService.add(formData);
        console.log(message)
        history.push('/status-organization')
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            event.preventDefault()
            handleCreateData()
        }
      };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                <Form.Group as={Row} controlId="title">
                    <Form.Label column sm={2}>
                    Judul
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, title: e.target.value})
                        }} required type="text" placeholder="Masukkan Judul" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Judul
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="description">
                    <Form.Label column sm={2}>
                    Deksripsi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, description: e.target.value})
                        }} required type="text" placeholder="Masukkan Deskripsi" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Deskripsi
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 6 }}>
                        <Button onClick={() => history.push('/status-organization')} className='mr-5' variant='secondary' >Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    )
}

export default InputOrganizationStatus
