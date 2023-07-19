import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls';
import ShowAlert from '../../libs/ShowAlert';
import { RegionAdministratorServices, PengurusService } from '../../services';
import RegionAdministratorForm from './Form';

export function PengurusEditPage(props) {
  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const history = useHistory();

  const getData = async () => {
    let { data, error } = await PengurusService.read({
      id: props.match.params.id,
    });
    if (data) {
      setFormData({
        id: props.match.params.id,
        name: data.name,
        jabatan_id: data.jabatan_id,
      });
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const prevPage = () => {
    history.goBack();
  };

  const handleFormDataChanges = (changes) => {
    setFormData(changes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      updateAdministrator();
    }
  };

  const updateAdministrator = async () => {
    let { data, error } = await PengurusService.update(null, formData);
    if (data) {
      prevPage();
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  return (
    <Card>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className='card-in-form'>
        <CardHeader title='Perbarui Pengurus'>
          <CardHeaderToolbar>
            <button type='button' className='btn btn-success mr-2' onClick={prevPage}>
              Batal
            </button>
            <Button type='submit' className='btn btn-primary mr-2'>
              Simpan
            </Button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <RegionAdministratorForm data={formData} errors={errors} onChange={handleFormDataChanges} />
        </CardBody>
      </Form>
    </Card>
  );
}

export default PengurusEditPage;
