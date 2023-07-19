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
import ShowToast from "../../libs/ShowToast";
import { UserServices } from "../../services";
import MemberForm from "./MemberForm";

export function MemberEditPage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/member",
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await UserServices.getMemberDetail({
      id: props.match.params.id,
    });
    if (data) {
      setFormData({
        id: data.id,
        name: data.name,
        nik: data.nik,
        cities_id: data.cities_id,
        phone_number: data.phone_number,
        organitation_parent_id: data.organitation_parent_id,
        email: data.email,
        password: ''
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
      updateMember();
    }
  };

  const updateMember = async () => {
    let { data, error } = await UserServices.updateMember(null, formData, formData.id);
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
            <CardHeader title="Rincian Anggota">
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
                <Button
                  type="submit"
                  className="btn btn-primary mr-2"
                >
                  Simpan
                </Button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <MemberForm
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

export default MemberEditPage;
