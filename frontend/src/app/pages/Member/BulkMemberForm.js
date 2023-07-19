import * as _ from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import constants from "../../libs/constants";
import OrganizationStatusService from "../../services/modules/OrganizationStatusService";
import { useSelector, shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CommissionServices,
  MasterServices,
  ParentOrganizationServices,
} from "../../services";

export function BulkMemberForm(props) {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [validated, setValidated] = useState(false);
  const [members, setMembers] = useState([]);
  const [organizationStatuses, setOrganizationStatuses] = useState([]);
  const [mainOrganizations, setMainOrganizations] = useState([]);
  const [errors, setErrors] = useState({
    'email':  '',
    'phone_number':  '',
  });

  const [newMember, setNewMember] = useState({
    name: "",
    nik: "",
    email: "",
    organitation_status_id: "",
    phone_number: "",
  });

  const user = useSelector((state) => state.auth.user, shallowEqual);
  const province_id = user?.provinces_id;
  const roleId = user?.role;

  const AddMemberSchema = Yup.object().shape({
    name: Yup.string()
        .required("Bidang isian nama harus diisi"),
    nik: Yup.number()
        .required("Bidang isian nik harus diisi")
        .typeError('Bidang isian nik harus angka')
        .test('len', 'Bidang Isian nik harus tepat 16 digit', (val) => val.toString().length > 15 && val.toString().length <= 16),
    email: Yup.string()
        .email("Bidang isian email format tidak valid"),
    phone_number: Yup.number()
        .required("Bidang Isian Nomor HP harus diisi")
        .test('len', 'Bidang Isian Nomor HP tidak boleh lebih dari 13 digit', (val) => val.toString().length < 13)
        // .max(13, 'Bidang Isian Nomor HP tidak boleh lebih dari 13 digit')
        .typeError('Bidang isian Nomor HP harus angka'),
    parent: (roleId == 0 || roleId == 7 ) ? Yup.string()
         .required("Bidang isian induk organisasi harus diisi") : Yup.string(),
    organitation_status_id: Yup.string()
        .required("Bidang isian organisasi status harus diisi"),
    province: (roleId == 0 || roleId == 1) ? Yup.string()
        .required("Bidang isian provinsi harus diisi") : Yup.string(),
    city: (roleId == 0 || roleId == 1 || roleId == 2) ? Yup.string()
        .required("Bidang isian kota harus diisi") : Yup.string(),
  });


  // validation
  const formik = useFormik({
    initialValues: {
      name: "",
      nik: "",
      email: "",
      phone_number: "",
      parent: "",
      organitation_status_id: "",
      province: "",
      city: "",
    },
    validationSchema: AddMemberSchema,
    onSubmit: (values, { setStatus, setSubmitting, setFieldError, resetForm }) => {
      // handle email dan phone number nggak diisi dua2nya

      let success = true;
      if(!values.email && !values.phone_number) {
        setFieldError('email', "Bidang Isian email dan no tlp harus diisi salah satu")
        setFieldError('phone_number', "Bidang Isian email dan no tlp harus diisi salah satu")
        success = false;
      }

      if(values.phone_number.length > 13)
      {
        setFieldError('phone_number', "Bidang Isian no tlp tidak boleh lebih dari 13 digit")
        success = false;
      }

      if(values.nik.length < 16 || values.nik.length > 16) {
        setFieldError('nik', "Bidang Isian nik harus tepat 16 digit")
        success = false;
      }

      if(!values.province && (roleId == 0 || roleId == 1))
      {
        setFieldError('province', "Bidang Isian provinsi harus dipilih")
        success = false;
      }

      if(!values.city && (roleId == 0 || roleId == 1 || roleId == 2))
      {
        setFieldError('city', "Bidang Isian kota harus dipilih")
        success = false;
      }

      if(!success)
        setSubmitting(false)

      if(success) {
        let memberList = [...members];
        memberList.push(values);
        setMembers(memberList);
        props.onChange(memberList);
        resetForm();
      }
    }
  });

  const provinceSelected = async (value, index = 0) => {
    formik.setFieldValue('province', value);
    await getDataCities("", value, index);
  }

  useEffect(() => {
    getOrganizationStatuses();
    getDataProvinces();
    getMainOrganization();
    if(roleId == 2){
      getDataCities("",province_id,0)
    }
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

  const getDataCities = async (search = "", province_id = 0, index = 0) => {
    let cts = cities;
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
      province_id: province_id
    });
    if (data) {
      cts[index] = data;
      setCities(cts);
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

  const getOrganizationStatuses = async (search = "") => {
    let { data, error } = await OrganizationStatusService.browse({});
    if (data) {
      let statuses = data.data.map((status) => {
        return {
          value: status.id,
          label: status.title,
        };
      });
      setOrganizationStatuses(statuses);
    }
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, function(o) {
      return o.value == selectedValue;
    });
    return index !== -1 ? list[index] : null;
  };

  const handleChanges = async (e, name = null, index = 0) => {
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
    let newData = { ...newMember };
    newData[property] = value;
    await setNewMember(newData);
    if(name == "province"){
      await getDataCities("", value, index)
    }
    let error = {
      email: "",
      phone_number: "",
    };

    if(newMember.email == "" && newMember.phone_number == "")
    {
      error = {
        email: "Email atau No. Hp harus diisi",
        phone_number: "Eamil atau No. Hp harus diisi",
      }
    }

    await setErrors(error);

  };

  const addMember = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      let memberList = [...members];
      memberList.push(newMember);
      setMembers(memberList);
      props.onChange(memberList);
      setNewMember(
        JSON.parse(
          JSON.stringify({
            name: "",
            nik: "",
            email: "",
            phone_number: "",
            organitation_status_id: "",
          })
        )
      );
      setValidated(false);
    }
  };

  const removeMember = (index) => {
    let memberList = [...members];
    console.log(memberList);
    memberList.splice(index, 1);
    setMembers(memberList);
  };

  useEffect(() => {}, []);

  return (
    <>

      { Array.isArray(props.errors) && (
        <ul>
        { props.errors.map((error, index) => (
          <li><span className="text-danger">{error}</span></li>
        ))}
        </ul>
      )}
      {members.map((member, index) => (
        <div
          className="row"
          style={{ borderBottom: "solid 1px #dedede", marginBottom: "20px" }}
          key={index}
        >
          <div className="col-md-11">
            <div className="row">
              <div className="col-md-3">
                <Form.Group controlId="name">
                  <Form.Label>Nama</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChanges(e)}
                    required
                    type="text"
                    value={member.name}
                    placeholder="Nama"
                    name="name"
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Mohon Masukkan Nama Anggota
                  </Form.Control.Feedback>
                  <ValidationAlert state={props.errors} stateKey="name" />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group controlId="nik">
                  <Form.Label>NIK</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChanges(e)}
                    required
                    type="text"
                    value={member.nik}
                    placeholder="NIK"
                    name="nik"
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Mohon Masukkan NIK Anggota
                  </Form.Control.Feedback>
                  <ValidationAlert state={props.errors} stateKey="nik" />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    value={member.email}
                    type="text"
                    placeholder="Masukkan Email"
                    onChange={(e) => handleChanges(e)}
                    required
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Mohon Masukkan Email
                  </Form.Control.Feedback>
                  <ValidationAlert state={props.errors} stateKey="email" />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group controlId="phone_number">
                  <Form.Label>Nomor HP</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChanges(e)}
                    required
                    type="text"
                    value={member.phone_number}
                    placeholder="Masukkan Nomor HP"
                    name="phone_number"
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Mohon Masukkan Nomor HP
                  </Form.Control.Feedback>
                  <ValidationAlert
                    state={props.errors}
                    stateKey="phone_number"
                  />
                </Form.Group>
              </div>
              {roleId == 0 ? 
              <div className="col-md-3">
                  <Form.Label>
                    Induk Olahraga
                  </Form.Label>
                    <Select
                      name="parent"
                      options={mainOrganizations}
                      onChange={(e) => handleChanges(e, "parent")}
                      value={getSelected(
                        mainOrganizations,
                        member.parent
                      )}
                    isDisabled
                    />
                    <ValidationAlert
                      state={props.errors}
                      stateKey="parent"
                    />
                    <Form.Control.Feedback type="invalid">
                      Pilih Induk Olahraga
                    </Form.Control.Feedback>
              </div>
              :null}
              {roleId == 0 || roleId == 1 ? 
              <div className="col-md-3">
                <Form.Label>Provinsi</Form.Label>
                  <Select
                    name="province"
                    options={provinces}
                    onChange={(e) => handleChanges(e, "province", index)}
                    value={getSelected(provinces, member.province)}
                    isDisabled
                  />
                  <ValidationAlert state={props.errors} stateKey="province" />
                  <Form.Control.Feedback type="invalid">
                    Pilih Wilayah
                  </Form.Control.Feedback>
              </div> : null }
              <div className="col-md-3">
                <Form.Label>
                  Kota
                </Form.Label>
                  <Select
                    name="city"
                    options={ roleId==2 ? cities[0]: cities[index]}
                    onChange={(e) => handleChanges(e, "city")}
                    value={getSelected(roleId==2 ? cities[0]: cities[index] , member.city)}
                    isDisabled
                  />
                  <ValidationAlert state={props.errors} stateKey="city" />
                  <Form.Control.Feedback type="invalid">
                    Pilih Wilayah
                  </Form.Control.Feedback>
              </div>
              <div className="col-md-3">
                <Form.Label>Status Organisasi</Form.Label>
                <Select
                  name="organitation_status_id"
                  options={organizationStatuses}
                  onChange={(e) => handleChanges(e, "organitation_status_id")}
                  value={getSelected(
                    organizationStatuses,
                    member.organitation_status_id
                  )}
                  isDisabled
                />
                <ValidationAlert
                  state={props.errors}
                  stateKey="organitation_status_id"
                />
                <Form.Control.Feedback type="invalid">
                  Pilih Status Organisasi
                </Form.Control.Feedback>
              </div>
            </div>
          </div>
          <div className="col-md-1">
            <Form.Group controlId="name">
              <Form.Label> </Form.Label>
              <br />
              <Button
                type="button"
                className="btn btn-danger mr-2"
                onClick={(e) => removeMember(index)}
              >
                <i className="fa fa-minus"></i>
              </Button>
            </Form.Group>
          </div>
        </div>
      ))}
      {members.length < constants.bulkAddMemberLength && (
        <Form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-11">
              <div className="row">
                <div className="col-md-3">
                  <Form.Group controlId="name">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nama"
                      name="name"
                      disabled={props.readOnly}
                      isInvalid={formik.touched.name && formik.errors.name}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.name}</div>
                        </div>
                    ) : null}
                    {/*<ValidationAlert state={formik.errors} stateKey="name" />*/}
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group controlId="nik">
                    <Form.Label>NIK</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="NIK"
                      name="nik"
                      disabled={props.readOnly}
                      isInvalid={formik.touched.nik && formik.errors.nik}
                      {...formik.getFieldProps("nik")}
                    />
                    {formik.touched.nik && formik.errors.nik ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.nik}</div>
                        </div>
                    ) : null}
                    <ValidationAlert state={props.errors} stateKey="nik" />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="text"
                      placeholder="Masukkan Email"
                      disabled={props.readOnly}
                      isInvalid={formik.touched.email && formik.errors.email}
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.email}</div>
                        </div>
                    ) : null}
                    <ValidationAlert state={props.errors} stateKey="email" />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group controlId="phone_number">
                    <Form.Label>Nomor HP</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChanges(e)}
                      type="text"
                      placeholder="Masukkan Nomor HP"
                      name="phone_number"
                      disabled={props.readOnly}
                      isInvalid={formik.touched.phone_number && formik.errors.phone_number}
                      {...formik.getFieldProps("phone_number")}
                    />
                    {formik.touched.phone_number && formik.errors.phone_number ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.phone_number}</div>
                        </div>
                    ) : null}
                    <ValidationAlert
                      state={props.errors}
                      stateKey="phone_number"
                    />
                  </Form.Group>
                </div>
              {roleId == 0 ?
                <div className="col-md-3">
                  <Form.Label>
                    Induk Olahraga
                  </Form.Label>
                    <Select
                      name="parent"
                      options={mainOrganizations}
                      onChange={(e) => formik.setFieldValue('parent', e.value)}
                      value={getSelected(
                        mainOrganizations,
                        formik.values.parent
                      )}
                    />
                  {formik.touched.parent && formik.errors.parent ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.parent}</div>
                      </div>
                  ) : null}
                  <ValidationAlert state={props.errors} stateKey="parent" />
              </div>
              :null}
              {roleId == 0 || roleId == 1 ?
                <div className="col-md-3">
                <Form.Label>Provinsi</Form.Label>
                  <Select
                    name="province"
                    options={provinces}
                    onChange={(e) => provinceSelected(e.value, members.length)}
                    value={getSelected(
                        provinces, formik.values.province
                    )}
                  />
                  {formik.touched.province && formik.errors.province ? (
                      <ValidationAlert state={formik.errors} stateKey="province" />
                  ) : null}
                  <Form.Control.Feedback type="invalid">
                    Pilih Wilayah
                  </Form.Control.Feedback>
              </div>
              :null}
              {roleId == 0 || roleId == 1 || roleId == 2 ?
              <div className="col-md-3">
                <Form.Label>
                  Kota
                </Form.Label>
                  <Select
                    name="city"
                    options={ roleId==2 ? cities[0]: cities[members.length]}
                    onChange={(e) => formik.setFieldValue('city', e.value)}
                    value={getSelected(
                        roleId==2 ? cities[0]: cities[members.length], formik.values.city
                    )}
                  />
                {formik.touched.city && formik.errors.city ? (
                    <ValidationAlert state={formik.errors} stateKey="city" />
                  ) : null}
                  <Form.Control.Feedback type="invalid">
                    Pilih Wilayah
                  </Form.Control.Feedback>
              </div>
              :null}

                <div className="col-md-3">
                  <Form.Label>Status Organisasi</Form.Label>
                  <Select
                    name="organitation_status_id"
                    options={organizationStatuses}
                    onChange={(e) => formik.setFieldValue('organitation_status_id', e.value)}
                    value={getSelected(
                      organizationStatuses,
                      formik.values.organitation_status_id
                    )}
                    isDisabled={props.readOnly}
                  />
                  {formik.touched.organitation_status_id && formik.errors.organitation_status_id ? (
                      <ValidationAlert state={formik.errors} stateKey="organitation_status_id" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="col-md-1">
              <Form.Group controlId="name">
                <Form.Label> </Form.Label>
                <br />
                <Button type="submit" className="btn btn-primary mr-2">
                  <i className="fa fa-plus"></i>
                </Button>
              </Form.Group>
            </div>
          </div>
        </Form>
      )}
    </>
  );
}

export default BulkMemberForm;
