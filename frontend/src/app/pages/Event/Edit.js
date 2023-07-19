import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ShowAlert from "../../libs/ShowAlert";
import { EventServices } from "../../services";
import EventForm from "./EventForm";

export function EventEditPage(props) {
  const [formData, setFormData] = useState({});
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/event",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const getData = async () => {
    let { data, error } = await EventServices.read({
      id: props.match.params.id,
    });
    if (data) {
      setFormData({
        id: props.match.params.id,
        title: data.title,
        tags: data.tags,
        category: !data.category ? 'OFFLINE' : data.category,
        event_organizer: data.event_organizer,
        webinar_url: data.webinar_url,
        location: data.location,
        price: data.price,
        end_registration: data.end_registration
          ? data.end_registration.split(" ")[0]
          : null,
        start_registration: data.start_registration
          ? data.start_registration.split(" ")[0]
          : null,
        event_date: data.event_date ? data.event_date.split(" ")[0] : null,
        event_time: data.event_date ? data.event_date.split(" ")[1] : null,
        event_end_time: data.event_end_date ? data.event_end_date.split(" ")[1] : null,
        description: data.description,
        displayImage: data.image,
        event_files: data.event_files,
        is_publish: data.is_publish,
        type_id: data.type_id,
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
      updateEvent();
    }
  };

  const updateEvent = async () => {
    let sendData = { ...formData };
    let tempEventDate = sendData.event_date;
    sendData.event_date = tempEventDate + " " + sendData.event_time;

    console.log(sendData.event_end_time.length, 'asdasds')
    if(sendData.event_end_time.length <= 5)
      sendData.event_end_date = tempEventDate + " " + sendData.event_end_time + ":00";
    else
      sendData.event_end_date = tempEventDate + " " + sendData.event_end_time;
    let { data, error } = await EventServices.edit(sendData);
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
            <CardHeader title="Perbarui Acara">
            </CardHeader>
            <CardBody>
              <EventForm
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

export default EventEditPage;
