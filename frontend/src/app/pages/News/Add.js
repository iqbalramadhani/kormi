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
import { NewsServices } from "../../services";
import NewsForm from "./NewsForm";

export function NewsAddPage() {
  const [formData, setFormData] = useState({
    category: "News",
  });
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/news",
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
      formData.is_publish = -1;
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      // console.log(formData);
      saveNews()
    }

  };

  const saveNews = async () => {
    if (!formData.video_url) delete formData.video_url
    // console.log(formData);
    let { data, error } = await NewsServices.add(formData);
    if (data) {
      const redirect = { ...previousPage, redirect: true };
      setPreviousPage(redirect);
    }
    if (error) {
      if (error) {
        for (const [key, value] of Object.entries(error.error)) {
          ShowAlert.failed(value[0] + ' Tambahkan http:// atau https:// di depan URL Video');
        }
      } 
      setErrors(error);
    }
  }

  return (
    <>
      {previousPage.redirect ? (
        <Redirect to={previousPage.route} />
      ) : (
        <Card>
          <Form noValidate validated={validated}  onSubmit={handleSubmit} className="card-in-form">
            <CardHeader title="Tambah Berita">
            </CardHeader>
            <CardBody>
              <NewsForm
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

export default NewsAddPage;
