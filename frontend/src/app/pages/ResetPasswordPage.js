import React, {useState} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../_metronic/_partials/controls'
import { AdministratorServices } from '../services'

export function ResetPasswordPage() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    
    let history = useHistory();

    const handleEditData = async () => {
        let { message } = await AdministratorServices.edit(null, {password: formData.password, password_confirmation: formData.password_confirmation, code: formData.code}, null);
        console.log(message)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        console.log(formData)
        handleEditData()
        if (form.checkValidity() === true){
            history.push('/dashboard')
        }
      };
    return (
        <div>
            <Card>
                <CardHeader title="Reset Password">
                    <CardHeaderToolbar HeaderToolbar>
            
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                <Form.Group as={Row} controlId="password">
                    <Form.Label column sm={2}>
                    Password Baru
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, password: e.target.value})
                        }} required type="password" placeholder="Masukkan Password Baru" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Password Baru
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="confirPassword">
                    <Form.Label column sm={2}>
                    Password Confirmasi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, password_confirmation: e.target.value})
                        }} required type="password" placeholder="Masukkan Password Yang Sama" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Password Confirmasi
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="code">
                    <Form.Label column sm={2}>
                    Code
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control onChange={(e) => {
                            setFormData({...formData, code: e.target.value})
                        }} required type="text" pattern='[0-9]*' placeholder="Masukkan Code" />
                        <Form.Control.Feedback type='invalid'>
                            Mohon Masukkan Code
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
                </CardBody>
            </Card>
        </div>
    )
}


export default ResetPasswordPage
