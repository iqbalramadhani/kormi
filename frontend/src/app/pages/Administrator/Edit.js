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
import { AdministratorServices } from "../../services";
import AdministratorForm from "./AdministratorForm";

export function AdministratorEditPage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/administrator",
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await AdministratorServices.read({
      id: props.match.params.id,
    });
    if (data) {
      setFormData({
        id: props.match.params.id,
        id_province: data.id_province,
        city_id: data.city_id,
        type: data.type,
        no_sk: data.no_sk,
        about: data.about,
        last_date_sk: data.last_date_sk ? data.last_date_sk.split(" ")[0] : null,
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
      updateAdministrator();
    }
  };

  const updateAdministrator = async () => {
    let { data, error } = await AdministratorServices.edit(null, formData);
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
            <CardHeader title="Perbarui Pengurus">
              <CardHeaderToolbar>
                <button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={() => {
                    setPreviousPage({ ...previousPage, redirect: true });
                  }}
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="btn btn-primary mr-2"
                >
                  Simpan
                </Button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <AdministratorForm
                data={formData}
                errors={errors}
                onChange={handleFormDataChanges}
              />
            </CardBody>
          </Form>
        </Card>
      )}
    </>
  );
}

export default AdministratorEditPage;
