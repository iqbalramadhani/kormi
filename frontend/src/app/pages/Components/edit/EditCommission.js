import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { CommissionServices } from '../../../services'
import { useLocation } from 'react-router-dom'
import ShowAlert from '../../../libs/ShowAlert'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function EditCommission() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [data, setData] = useState({});

    let query = useQuery();
    let history = useHistory();
    let id = query.get("id")

    const getDataById = async () => {
        let {data, error } = await CommissionServices.detail(null , id);
        if (data) {
            setData(data);
          }
          if (error) {
            if (error.message) ShowAlert.failed(error.message);
          }
        console.log(data)
    }

    const handleEditData = async () => {
        let { message, error } = await CommissionServices.edit(null, {commission_no: formData.commission_no, commission_code: formData.commission_code, commission_name: formData.commission_name}, id);
        console.log(message)
        if (message) {
            history.push('/commission')
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
        if (form.checkValidity() === true) {
            handleEditData()
            event.preventDefault();
        }
      };

      useEffect(() => {
          getDataById();
      }, [id])
      
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
                        }} required type='text' defaultValue={data.commission_no} pattern='[0-9]*' placeholder="Masukkan Nomor Komisi" />   
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
                        }} required type='text' defaultValue={data.commission_code} pattern='[0-9]*' placeholder="Masukkan Kode Komisi" />   
                        <Form.Control.Feedback type='invalid'>
                        Mohon Masukkan Kode Komisi
                    </Form.Control.Feedback>          
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="namaKomisi">
                    <Form.Label column sm={2}>
                    Nama Komisi
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control defaultValue={data.commission_name} onChange={(e) => {
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

export default EditCommission
