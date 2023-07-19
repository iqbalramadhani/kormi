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
import { ParentOrganizationServices } from "../../services";
import MainOrganizationForm from "./MainOrganizationForm";

export function MainOrganizationEditPage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/main-organization",
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await ParentOrganizationServices.detail(null,  props.match.params.id);
    if (data) {
      setFormData({
        id: props.match.params.id,
        parent_no: data.parent_no,
        parent_name: data.parent_name,
        parent_code: data.parent_code,
        parent_sk: data.parent_sk,
        bank_name: data.bank_name,
        bank_account_no: data.bank_account_no,
        current_ad_rt: data.ad_rt,
        current_notarial_deed: data.notarial_deed,
        current_sk_kumham: data.sk_kumham,
        current_board_of_management: data.board_of_management,
        current_npwp: data.npwp,
        current_main_province: data.main_province,
        commission_id: data.commission_id,
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
      updateMainOrganization();
    }
  };

  const updateMainOrganization = async () => {
    let { data, error } = await ParentOrganizationServices.edit(formData, null, formData.id);
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
            <CardHeader title="Perbarui Data Komisi">
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
              <MainOrganizationForm
                data={formData}
                errors={errors}
                onChange={handleFormDataChanges}
                mode="EDIT"
              />
            </CardBody>
          </Form>
        </Card>
      )}
    </>
  );
}

export default MainOrganizationEditPage;
