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
import { NewsServices } from "../../services";
import NewsForm from "./NewsForm";

export function NewsEditPage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/news",
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await NewsServices.read({
      id: props.match.params.id,
    });
    if (data) {
      setFormData({
        id: props.match.params.id,
        title: data.title,
        tags: data.tags,
        description: data.description,
        category: data.category,
        displayImage: data.image,
        location: data.location,
        is_publish: data.is_publish,
        publish_time: data.publish_time,
        video_url: data.video_url,
        news_files: data.news_files,
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
      updateNews();
    }
  };

  const updateNews = async () => {
    if (!formData.video_url) delete formData.video_url
    let { data, error } = await NewsServices.edit(formData);
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
            <CardHeader title="Perbarui Berita">
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

export default NewsEditPage;
