import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import { MasterServices, AdministratorServices } from "../../services";
import * as _ from 'lodash';

export function AdministratorForm(props) {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  
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
    // if (name == 'type') {
    //   if (e.value == 2) await getDataProvinces();
    //   if (e.value == 3) await getDataCities();
    // }
    let value = e.value ? e.value : e.target.value;
    let newData = { ...props.data };
    newData[property] = value;
    props.onChange(newData);
  };

  useEffect(() => {
    getType();
    getDataProvinces();
    getDataCities();
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
    let cts = cities;
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
    });
    if (data) {
      setCities(data);
    }
  };

  const getType = async () => {
    let { data } = await AdministratorServices.type();
    if (data) {
      setTypes(data);
    }
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, ['value', parseInt(selectedValue)]);
    return index !== -1 ? list[index] : null;
  }

  // const getPropsData = () => {
  //   if (props.data.type && props.data.type == 2) {
  //     getDataProvinces();
  //     return
  //   }
  //   if (props.data.type && props.data.type == 3) {
  //     getDataCities();
  //     return
  //   }
  // };

  return (
    <div className="row">
      <div className="col-md-12">
      <Form.Group as={Row} controlId="no_sk">
          <Form.Label column sm={2}>
            Nomor SK
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              defaultValue={props.data.no_sk}
              placeholder="Masukkan Nomor SK"
              name="no_sk"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nomor SK
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="no_sk" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="type">
          <Form.Label column sm={2}>
            Status Kepengurusan
          </Form.Label>
          <Col sm={10}>
            <Select
              name="type"
              options={types}
              onChange={(e) => handleChanges(e, "type")}
              value={getSelected(types, props.data.type)}
            />
            <ValidationAlert state={props.errors} stateKey="type" />
            <Form.Control.Feedback type="invalid">
              Pilih Status Kepengurusan
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {
          (props.data.type && props.data.type == 2) && (
            <Form.Group as={Row} controlId="id_province">
              <Form.Label column sm={2}>
                Provinsi
              </Form.Label>
              <Col sm={10}>
                <Select
                  name="id_province"
                  options={provinces}
                  onChange={(e) => handleChanges(e, "id_province")}
                  value={getSelected(provinces, props.data.id_province)}
                />
                <ValidationAlert state={props.errors} stateKey="id_province" />
                <Form.Control.Feedback type="invalid">
                  Pilih Provinsi
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          )
        }

        {
          (props.data.type && props.data.type == 3) && (
            <Form.Group as={Row} controlId="city_id">
              <Form.Label column sm={2}>
                Kota/Kab
              </Form.Label>
              <Col sm={10}>
                <Select
                  name="city_id"
                  options={cities}
                  onChange={(e) => handleChanges(e, 'city_id')}
                  value={getSelected(cities, props.data.city_id)}
                />
                <ValidationAlert state={props.errors} stateKey="city_id" />
                <Form.Control.Feedback type="invalid">
                  Pilih Kota/Kab
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          )
        }


        <Form.Group as={Row} controlId="about">
          <Form.Label column sm={2}>
            Deskripsi SK
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              name="about"
              as="textarea"
              rows={3}
              defaultValue={props.data.about}
              placeholder="Masukkan Deskripsi"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Deskripsi SK
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="about" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="last_date_sk">
          <Form.Label column sm={2}>
            Masa Bakti
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="last_date_sk"
              defaultValue={props.data.last_date_sk}
              type="date"
              placeholder="Masukkan Masa Bakti"
              onChange={(e) => handleChanges(e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Masa Bakti
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="last_date_sk" />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default AdministratorForm;
