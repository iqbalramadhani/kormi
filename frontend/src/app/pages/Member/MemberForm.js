import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import { MasterServices, ParentOrganizationServices } from "../../services";
import * as _ from "lodash";

export function MemberForm(props) {
  const [cities, setCities] = useState([]);
  const [mainOrganizations, setMainOrganizations] = useState([]);

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

  useEffect(() => {
    getDataCities();
    getMainOrganization();
  }, []);

  const getDataCities = async (search = "") => {
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
    });
    if (data) {
      let cities = data.map((city) => {
        return { value: city.id, label: city.name };
      });
      setCities(cities);
    }
  };

  const getMainOrganization = async (search = "") => {
    let { data, error } = await ParentOrganizationServices.browse({});
    if (data) {
      let parentOrganizations = data.data.map((parentOrganization) => {
        return {
          value: parentOrganization.id,
          label: parentOrganization.parent_name,
        };
      });
      setMainOrganizations(parentOrganizations);
    }
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, ["value", parseInt(selectedValue)]);
    return index !== -1 ? list[index] : null;
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Form.Group as={Row} controlId="id">
          <Form.Label column sm={2}>
            ID Anggota
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.member_number}
              placeholder="ID Anggota"
              name="id"
              disabled
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan ID ANggota
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="id" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="nik">
          <Form.Label column sm={2}>
            NIK
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.nik}
              placeholder="NIK"
              name="nik"
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan NIK Anggota
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="nik" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="name">
          <Form.Label column sm={2}>
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.name}
              placeholder="Nama"
              name="name"
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama ANggota
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="name" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="cities_id">
          <Form.Label column sm={2}>
            Kota/Kabupaten
          </Form.Label>
          <Col sm={10}>
            <Select
              name="cities_id"
              options={cities}
              onChange={(e) => handleChanges(e, "cities_id")}
              value={getSelected(cities, props.data.cities_id)}
              isDisabled={props.readOnly}
            />
            <ValidationAlert state={props.errors} stateKey="cities_id" />
            <Form.Control.Feedback type="invalid">
              Pilih Kota/Kabupaten
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="phone_number">
          <Form.Label column sm={2}>
            Nomor HP
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="phone_number"
              defaultValue={props.data.phone_number}
              type="text"
              placeholder="Masukkan Nomor HP"
              onChange={(e) => handleChanges(e)}
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nomor HP
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="phone_number" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="email">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="email"
              defaultValue={props.data.email}
              type="text"
              placeholder="Masukkan Email"
              onChange={(e) => handleChanges(e)}
              required
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Email
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="email" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="password">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="password"
              defaultValue={props.data.password}
              type="text"
              placeholder="Masukkan Password"
              onChange={(e) => handleChanges(e)}
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Password
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="password" />
          </Col>
        </Form.Group>

        
        <Form.Group as={Row} controlId="organitation_parent_id">
          <Form.Label column sm={2}>
            Induk Olahraga
          </Form.Label>
          <Col sm={10}>
            <Select
              name="organitation_parent_id"
              options={mainOrganizations}
              onChange={(e) => handleChanges(e, "organitation_parent_id")}
              value={getSelected(
                mainOrganizations,
                props.data.organitation_parent_id
              )}
              isDisabled={props.readOnly}
            />
            <ValidationAlert
              state={props.errors}
              stateKey="organitation_parent_id"
            />
            <Form.Control.Feedback type="invalid">
              Pilih Induk Olahraga
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default MemberForm;
