import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import { JabatanServices } from "../../services";
import * as _ from 'lodash';

export function RegionAdministratorForm(props) {
  const [jabatanList, setJabatanList] = useState([]);
  
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
    let value = e.value ? e.value : name == 'jabatan' ? e.id : e.target.value;
    let newData = { ...props.data };
    newData[property] = value;
    props.onChange(newData);
  };

  const getJabatanList = async () => {
    let { data } = await JabatanServices.list();
    if (data) {
      let jabatan = data.map((item) => {
        return { value: item.id, label: item.name };
      });
      setJabatanList(jabatan);
    }
  };

  useEffect(() => {
    getJabatanList();
  }, []);


  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, ['value', parseInt(selectedValue)]);
    return index !== -1 ? list[index] : null;
  }

  return (
    <div className="row">
      <div className="col-md-12">
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
              />
              <Form.Control.Feedback type="invalid">
                Mohon Masukkan Nama
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="name" />
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="jabatan_id">
          <Form.Label column sm={2}>
            Jabatan
          </Form.Label>
          <Col sm={10}>
            <Select
              name="jabatan_id"
              options={jabatanList}
              onChange={(e) => handleChanges(e, "jabatan_id")}
              value={getSelected(jabatanList, props.data.jabatan_id)}
            />
            <ValidationAlert state={props.errors} stateKey="jabatan_id" />
            <Form.Control.Feedback type="invalid">
              Pilih Jabatan
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        
      </div>
    </div>
  );
}

export default RegionAdministratorForm;
