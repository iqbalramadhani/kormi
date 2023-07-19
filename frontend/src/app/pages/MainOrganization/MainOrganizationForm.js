import * as _ from "lodash";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import { CommissionServices } from "../../services";

export function MainOrganizationForm(props) {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    getCommission();
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

  const getCommission = async (search = "") => {
    let { data, error } = await CommissionServices.browse({});
    if (data) {
      let commissions = data.data.map((commission) => {
        return {
          value: commission.id,
          label: commission.commission_name,
        };
      });
      setCommissions(commissions);
    }
  };

  const handleChanges = async (e, name = null) => {
    console.log(e.target.value);
    let property = name
      ? name
      : e
      ? e.target
        ? e.target.name
          ? e.target.name
          : ""
        : ""
      : "";
    let newData = { ...props.data };

    if (e.target && e.target.files && e.target.files.length > 0) {
      newData[property] = e.target.files[0];
    } else {
      let value = e.value !== undefined ? e.value : e.target.value;
      newData[property] = value;
    }
    props.onChange(newData);
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
        <Form.Group as={Row} controlId="parent_no">
          <Form.Label column sm={2}>
            No. Induk
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              name="parent_no"
              defaultValue={props.data.parent_no}
              placeholder="Masukkan Nomor Induk"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan No. Induk
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="parent_no" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="parent_code">
          <Form.Label column sm={2}>
            Kode Induk
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              name="parent_code"
              defaultValue={props.data.parent_code}
              placeholder="Masukkan Kode Induk"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Kode Induk
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="parent_code" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="parent_name">
          <Form.Label column sm={2}>
            Nama Induk
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              name="parent_name"
              defaultValue={props.data.parent_name}
              type="text"
              placeholder="Masukkan Nama Induk"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama Induk
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="parent_name" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="parent_sk">
          <Form.Label column sm={2}>
            SK Induk Organisasi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              required
              type="text"
              name="parent_sk"
              defaultValue={props.data.parent_sk}
              placeholder="Masukkan SK Induk Organisasi"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan SK Induk Organisasi
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="parent_sk" />
          </Col>
        </Form.Group>      

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Pilih Komisi
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="commission_id"
              as="select"
              placeholder="Pilih Komisi"
              onChange={(e) => handleChanges(e, "commission_id")}
              value={props.data.commission_id}
              required
            >
              <option value="">Pilih Komisi</option>
              {commissions.map((commission) => (
                <option value={commission.value} key={commission.value}>
                  {commission.label}
                </option>
              ))}
            </Form.Control>
            <ValidationAlert state={props.errors} stateKey="commission_id" />
            <Form.Control.Feedback type="invalid">
              Pilih Komisi
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="fileADRT">
          <Form.Label column sm={2}>
            AD/RT
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="ad_rt"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.ad_rt ? props.data.ad_rt.name : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="ad_rt" />
              {props.data.current_ad_rt && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a href={props.data.current_ad_rt} target="_blank">
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="aktaNotarif">
          <Form.Label column sm={2}>
            Akta Notarif
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="notarial_deed"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.notarial_deed
                  ? props.data.notarial_deed.name
                  : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="notarial_deed" />
              {props.data.current_notarial_deed && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a href={props.data.current_notarial_deed} target="_blank">
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="sk">
          <Form.Label column sm={2}>
            SK KUMHAM
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="sk_kumham"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.sk_kumham
                  ? props.data.sk_kumham.name
                  : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="sk_kumham" />
              {props.data.current_sk_kumham && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a href={props.data.current_sk_kumham} target="_blank">
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="susunanPengurus">
          <Form.Label column sm={2}>
            Susunan Pengurus
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="board_of_management"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.board_of_management
                  ? props.data.board_of_management.name
                  : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert
                state={props.errors}
                stateKey="board_of_management"
              />
              {props.data.current_board_of_management && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a
                    href={props.data.current_board_of_management}
                    target="_blank"
                  >
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="npwp">
          <Form.Label column sm={2}>
            NPWP
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="npwp"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.npwp ? props.data.npwp.name : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="npwp" />
              {props.data.current_npwp && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a href={props.data.current_npwp} target="_blank">
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="noRek">
          <Form.Label column sm={2}>
            Nomor Rekening
          </Form.Label>
          <Col sm={5}>
            <Form.Control
              onChange={(e) => handleChanges(e)}
              type="text"
              name="bank_name"
              defaultValue={props.data.bank_name}
              placeholder="Masukkan Name Bank"
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nama Bank
            </Form.Control.Feedback>
            <ValidationAlert state={props.errors} stateKey="bank_name" />
          </Col>
          <Col sm={5}>
            <Form.Control
              type="text"
              pattern="[0-9]*"
              placeholder="Masukkan Nomor Rekening"
              name="bank_account_no"
              defaultValue={props.data.bank_account_no}
              onChange={(e) => handleChanges(e)}
            />
            <Form.Control.Feedback type="invalid">
              Mohon Masukkan Nomor Rekening
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="proInduk">
          <Form.Label column sm={2}>
            8 Induk Provinsi
          </Form.Label>
          <Col sm={10}>
            <Form.File id="formcheck-api-custom" custom>
              <Form.File.Input
                accept="application/pdf"
                name="main_province"
                onChange={(e) => handleChanges(e)}
              />
              <Form.File.Label data-browse="Upload">
                {props.data.main_province
                  ? props.data.main_province.name
                  : "Upload file pdf"}
              </Form.File.Label>
              <Form.Control.Feedback type="invalid">
                Mohon masukkan file pdf
              </Form.Control.Feedback>
              <ValidationAlert state={props.errors} stateKey="main_province" />
              {props.data.current_main_province && (
                <Form.Text muted>
                  Unduh file existing{" "}
                  <a href={props.data.current_main_province} target="_blank">
                    Download
                  </a>
                </Form.Text>
              )}
            </Form.File>
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}

export default MainOrganizationForm;
