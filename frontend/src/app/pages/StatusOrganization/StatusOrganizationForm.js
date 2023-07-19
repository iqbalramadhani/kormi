import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ValidationAlert from "../../components/ValidationAlert";

export function StatusOrganizationForm(props) {
  const handleChanges = async (e) => {
    const newData = { ...props.data };
    newData[e.target.name] = e.target.value;
    props.onChange(newData);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Form.Group as={Row} controlId="title">
          <Form.Label column sm={2}>
            Judul
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              // pattern="[0-9]*"
              placeholder="Masukkan Judul"
              name="title"
              defaultValue={props.data.title}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Judul
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="title" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="description">
          <Form.Label column sm={2}>
            Deskripsi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              as="textarea"
              defaultValue={props.data.description}
              // pattern="[0-9]*"
              placeholder="Masukkan Deskripsi"
              name="description"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Deskripsi
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="description" />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default StatusOrganizationForm;
