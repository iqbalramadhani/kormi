import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import ShowAlert from "../../libs/ShowAlert";
import { ParentOrganizationServices } from "../../services";
import MainOrganizationForm from "./MainOrganizationForm";

export function MainOrganizationAddPage() {
  const [formData, setFormData] = useState({});
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/main-organization",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

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
      saveMainOrganization();
    }
  };

  const saveMainOrganization = async () => {
    let { data, error } = await ParentOrganizationServices.add(formData);
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
            <CardHeader title="Tambah Induk Organisasi">
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
                  // onClick={handleSubmit}
                >
                  Simpan
                </Button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <MainOrganizationForm
                data={formData}
                errors={errors}
                onChange={handleFormDataChanges}
                mode="ADD"
              />
            </CardBody>
          </Form>
        </Card>
      )}
    </>
  );
}

export default MainOrganizationAddPage;
