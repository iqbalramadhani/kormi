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
import { UserServices } from "../../services";
import MemberForm from "./MemberForm";

export function MemberDetailPage(props) {
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
        member_number: data.member_number,
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

  return (
    <>
      {previousPage.redirect ? (
        <Redirect to={previousPage.route} />
      ) : (
        <Card>
          <Form
            noValidate
            validated={validated}
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
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <MemberForm
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

export default MemberDetailPage;
