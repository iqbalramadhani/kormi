import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { OrganizationStatusService } from '../../../services'
import { useLocation } from 'react-router-dom'
import ShowAlert from '../../../libs/ShowAlert'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function EditOrganizationStatus() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [data, setData] = useState({});

    let query = useQuery();
    let history = useHistory();
    let id = query.get("id")

    const getDataById = async () => {
        let {data, error } = await OrganizationStatusService.detail(null , id);
        if (data) {
            setData(data);
          }
          if (error) {
            if (error.message) ShowAlert.failed(error.message);
          }
        console.log(data)
    }

    const handleEditData = async () => {
        let { message, error } = await OrganizationStatusService.edit(null, {title: formData.title, description: formData.description}, id);
        console.log(message)
        if (message) {
            history.push('/status-organization')
        }
        if (error) {
            ShowAlert.failed(error)
        }
    }


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true){
            handleEditData()
            event.preventDefault()
        }
      };

      useEffect(() => {
        getDataById();
    }, [id])

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                <Form.Group as={Row} controlId="title">
                    <Form.Label column sm={2}>
                    Judul
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control defaultValue={data.title} onChange={(e) => {
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
                        <Form.Control defaultValue={data.description} onChange={(e) => {
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

export default EditOrganizationStatus
