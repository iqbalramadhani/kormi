import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ValidationAlert from "../../components/ValidationAlert";

export function CommissionForm(props) {
  const handleChanges = async (e) => {
    const newData = { ...props.data };
    newData[e.target.name] = e.target.value;
    props.onChange(newData);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Form.Group as={Row} controlId="commission_no">
          <Form.Label column sm={2}>
            Nomor Komisi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              // pattern="[0-9]*"
              placeholder="Masukkan Nomor Komisi"
              name="commission_no"
              defaultValue={props.data.commission_no}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nomor Komisi
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="commission_no" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="commission_code">
          <Form.Label column sm={2}>
            Kode Komisi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.commission_code}
              // pattern="[0-9]*"
              placeholder="Masukkan Kode Komisi"
              name="commission_code"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Kode Komisi
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="commission_code" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="commission_name">
          <Form.Label column sm={2}>
            Nama Komisi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              name="commission_name"
              type="text"
              placeholder="Masukkan Nama Komisi"
              defaultValue={props.data.commission_name}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama Komisi
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="commission_name" />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default CommissionForm;
