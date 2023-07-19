import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ShowAlert from "../../libs/ShowAlert";
import { CmsAdministratorServices } from "../../services";
import CmsAdministratorForm from "./CmsAdministratorForm";

export function CmsAdministratorDetailPage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/cms-administrator",
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await CmsAdministratorServices.detail(null,  props.match.params.id);
    if (data) {
      setFormData({
        id: props.match.params.id,
        email: data.email,
        name: data.name,
        commission_id: data.commission_id,
        provinces_id: data.provinces_id,
        cities_id: data.cities_id,
        phone_number: data.phone_number,
        organitation_parent_id: data.organitation_parent_id,
        role: data.role,
      });
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      updateCmsAdministrator();
    }
  };

  const updateCmsAdministrator = async () => {
    let { data, error } = await CmsAdministratorServices.edit(null, formData, formData.id);
    if (data) {
      const redirect = { ...previousPage, redirect: true };
      setPreviousPage(redirect);
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  return (
    <>
      {previousPage.redirect ? (
        <Redirect to={previousPage.route} />
      ) : (
        <Card>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="card-in-form"
          >
            <CardHeader title="Rincian Admin">
            <CardHeaderToolbar>
                <button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={() => {
                    setPreviousPage({ ...previousPage, redirect: true });
                  }}
                >
                  Kembali
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <CmsAdministratorForm
                data={formData}
                errors={errors}
                onChange={handleFormDataChanges}
                readOnly
              />
            </CardBody>
          </Form>
        </Card>
      )}
    </>
  );
}

export default CmsAdministratorDetailPage;
