import React, { useState, useEffect } from "react";
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

export function EventAddPage() {
  const [formData, setFormData] = useState({});
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/event",
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    setFormData({category: 'OFFLINE'});
  }, [])

  const handleFormDataChanges = (changes) => {
    setFormData(changes)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      formData.is_publish = -1;
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      saveEvent()
    }
  }

  const saveEvent = async () => {
    let sendData = {...formData}
    let tempEventDate = sendData.event_date;
    sendData.event_date = tempEventDate + " " + sendData.event_time + ":00";
    sendData.event_end_date = tempEventDate + " " + sendData.event_end_time + ":00";
    if (sendData.category !== 'Seminar' && sendData.category !== 'OFFLINE') {
      sendData.location = 0
    }
    console.log(sendData)
    let { data, error } = await EventServices.add(sendData);
    if (data) {
      const redirect = {...previousPage, redirect: true};
      setPreviousPage(redirect)
    }
    if (error) {
      setErrors(error)
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
      <CardHeader title="Tambah Acara">
      </CardHeader>
      <CardBody>
        <EventForm data={formData} errors={errors} onChange={handleFormDataChanges} />
      </CardBody>
      </Form>
    </Card>
    )}
    </>
  );
}

export default EventAddPage;
