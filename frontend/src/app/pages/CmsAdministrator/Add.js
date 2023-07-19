import React, { useState } from "react";
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
import { useSelector, shallowEqual } from "react-redux";

export function CmsAdministratorAddPage() {
  const [formData, setFormData] = useState({});
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/cms-administrator",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;
  const parentId = user?.organitation_parent_id;

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
      saveCmsAdministrator()
    }

  };

  const saveCmsAdministrator = async () => {
    let newData = { ...formData };
    if (roleId != 0) {
      newData.organitation_parent_id = parentId;
    }
    let { data, error } = await CmsAdministratorServices.add(newData);
    if (data) {
      const redirect = { ...previousPage, redirect: true };
      setPreviousPage(redirect);
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  }

  return (
    <>
      {previousPage.redirect ? (
        <Redirect to={previousPage.route} />
      ) : (
        <Card>
          <Form noValidate validated={validated}  onSubmit={handleSubmit} className="card-in-form">
            <CardHeader title="Tambah Admin">
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
              <CmsAdministratorForm
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

export default CmsAdministratorAddPage;
