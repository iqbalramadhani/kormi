import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ValidationAlert from "../../components/ValidationAlert";

export function JabatanForm(props) {  
  const handleChanges = async (e, name = null) => {
    let property = name
      ? name
      : e
      ? e.target
        ? e.target.name
          ? e.target.name
          : ""
        : ""
      : "";
    let value = e.value ? e.value : e.target.value;
    let newData = { ...props.data };
    newData[property] = value;
    props.onChange(newData);
  };

  return (
    <div className="row">
      <div className="col-md-12">
      <Form.Group as={Row} controlId="name">
          <Form.Label column sm={2}>
            Nama Jabatan
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.name}
              placeholder="Masukkan Nama Jabatan"
              name="name"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama Jabatan
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="name" />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default JabatanForm;
