import * as _ from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import ShowAlert from "../../libs/ShowAlert";
import {
  CommissionServices,
  MasterServices,
  ParentOrganizationServices,
} from "../../services";
import { useSelector, shallowEqual } from "react-redux";

export function CmsAdministratorForm(props) {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [mainOrganizations, setMainOrganizations] = useState([]);
  const [roles, setRoles] = useState([]);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  
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
    let value = e.value !== undefined ? e.value : e.target.value;
    console.log(property, value);
    if (property == 'phone_number') {
      if (!/[0-9]/.test(value)) {
        value = "";
        document.getElementById('phone_number').value = "";
      } 
    }

    let newData = { ...props.data };
    newData[property] = value;
    props.onChange(newData);
  };
  
  useEffect(() => {
    getDataCities();
    getDataProvinces();
    getCommissions();
    getMainOrganization();
    getRoleList();
    console.log(roleId)
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
  }, []);

  const isNumber = (e) => {   
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  const getDataProvinces = async (search = "") => {
    let { data, error } = await MasterServices.browseProvince({
      search: search ? search : "",
      selectedForm: 1,
    });
    if (data) {
      let provinces = data.map((province) => {
        return { value: province.id, label: province.name };
      });
      setProvinces(provinces);
    }
  };

  const getDataCities = async (search = "") => {
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
    });
    if (data) {
      setCities(data);
    }
  };

  const getCommissions = async () => {
    let { data, error } = await CommissionServices.browse({});
    if (data && data.data !== undefined) {
      let commissions = data.data.map((commission) => {
        return {
          value: commission.id,
          label: commission.commission_code + "- " + commission.commission_name,
        };
      });
      setCommissions(commissions);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
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

  const getRoleList = async (search = "") => {
    let { data, error } = await MasterServices.getRoleList();
    if (data) {
      setRoles(data);
    }
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, function(o) {
      return o.value == selectedValue;
    });
    return index !== -1 ? list[index] : null;
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Form.Group as={Row} controlId="email">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="email"
              defaultValue={props.data.email}
              placeholder="Masukkan Email"
              name="email"
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Format email salah atau kolom email kosong
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="email" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="name">
          <Form.Label column sm={2}>
            Nama
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.name}
              placeholder="Masukkan Nama"
              name="name"
              disabled={props.readOnly}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="name" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="phone_number">
          <Form.Label column sm={2}>
            Nomor Handphone
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="tel"
              defaultValue={props.data.phone_number}
              placeholder="Masukkan Nomor Handphone"
              name="phone_number"
              disabled={props.readOnly}
              onKeyPress={(e) => isNumber(e)}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nomor Handphone
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="phone_number" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="role">
          <Form.Label column sm={2}>
            Role
          </Form.Label>
          <Col sm={10}>
            <Select
              name="role"
              options={roles}
              onChange={(e) => handleChanges(e, "role")}
              value={getSelected(roles, props.data.role)}
              isDisabled={props.readOnly}
            />
            <ValidationAlert state={props.errors} stateKey="role" />
            <Form.Control.Feedback type="invalid">
              Pilih Role
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {(props.data.role === 4 || props.data.role === 5) && (
          <Form.Group as={Row} controlId="commission_id">
            <Form.Label column sm={2}>
              Komisi
            </Form.Label>
            <Col sm={10}>
              <Select
                name="commission_id"
                options={commissions}
                onChange={(e) => handleChanges(e, "commission_id")}
                value={getSelected(commissions, props.data.commission_id)}
                isDisabled={props.readOnly}
              />
              <ValidationAlert state={props.errors} stateKey="commission_id" />
              <Form.Control.Feedback type="invalid">
                Pilih Komisi
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        )}
        {(props.data.role === 2 || props.data.role === 5) && (
          <Form.Group as={Row} controlId="region">
            <Form.Label column sm={2}>
              Provinsi
            </Form.Label>
            <Col sm={10}>
              <Select
                name="provinces_id"
                options={provinces}
                onChange={(e) => handleChanges(e, "provinces_id")}
                value={getSelected(provinces, props.data.provinces_id)}
                isDisabled={props.readOnly}
              />
              <ValidationAlert state={props.errors} stateKey="provinces_id" />
              <Form.Control.Feedback type="invalid">
                Pilih Wilayah
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        )}
        {props.data.role === 3 && (
          <Form.Group as={Row} controlId="region">
            <Form.Label column sm={2}>
              Kota
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
                Pilih Wilayah
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        )}

        {(props.data.role != 0 && roleId == 0) && (
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
        )}
      </div>
    </div>
  );
}

export default CmsAdministratorForm;
