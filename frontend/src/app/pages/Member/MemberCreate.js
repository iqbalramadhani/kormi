import * as _ from "lodash";
import React, { useEffect, useState } from "react";
import {Form, Row, Col} from "react-bootstrap";
import Select from "react-select";
import ValidationAlert from "../../components/ValidationAlert";
import constants from "../../libs/constants";
import OrganizationStatusService from "../../services/modules/OrganizationStatusService";
import { useSelector, shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2'
import {
  CommissionServices,
  MasterServices,
  ParentOrganizationServices,
  UserServices,
} from "../../services";
import {Redirect, useHistory} from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import mailIcon from "../../../icons/ic_mail.svg";

export function MemberCreate(props) {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [members, setMembers] = useState([]);
  const [organizationStatuses, setOrganizationStatuses] = useState([]);
  const [mainOrganizations, setMainOrganizations] = useState([]);
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/member",
  });
  const history = useHistory();

  const [formErrors, setFormErrors] = useState({
    city: "",
    email: "",
    name: "",
    nik: "",
    organitation_status_id: "",
    parent: "",
    phone_number: "",
    province: "",
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
    onSubmit: async (values, { setStatus, setSubmitting, setFieldError, resetForm }) => {
      // handle email dan phone number nggak diisi dua2nya
      let success = true;
      if(!values.email && !values.phone_number) {
        setFieldError('email', "Bidang Isian email dan no tlp harus diisi salah satu")
        setFieldError('phone_number', "Bidang Isian email dan no tlp harus diisi salah satu")
        success = false;
      }

      if(values.phone_number.length > 13)
      {
        setFieldError('phone_number', "Bidang Isian Nomor HP tidak boleh lebih dari 13 digit")
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
        let { data, error } = await UserServices.create(values);
        // console.log(data, "asdasdsa");
        // console.log(error, "asdasdsa");
        if(data) {
          Swal.fire({
            title: 'Data telah tersimpan',
            imageUrl: mailIcon,
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonText: 'Cek Halaman Anggota',
            confirmButtonColor: '#34C38F',
          }).then(result => {
            if (result.value) {
              history.push('/member');
            }
          })
          resetForm();
        }

        if(error.error)
          setFormErrors(error.error)

        if(error.message && !error.error) {
          Swal.fire({
            title: error.message,
            icon: 'error',
            showCancelButton: true,
          })
        }
      }
    }
  });

  const provinceSelected = (value, index = 0) => {
    formik.setFieldValue('province', value);
    getDataCities("", value, index);
  }

  useEffect(() => {
    getOrganizationStatuses();
    getDataProvinces();
    getMainOrganization();
    if(roleId == 2){
      getDataCities("",province_id,0)
    }
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

  const getDataCities = async (search = "", province_id = 0, index = 0) => {
    let cts = cities;
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
      province_id: province_id
    });
    if (data) {
      cts[index] = data;
      // setCities(cts);
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
  return (
    <>
        {previousPage.redirect ? (
            <Redirect to={previousPage.route} />
        ) : (
          <Card>
            <Form className="card-in-form" onSubmit={formik.handleSubmit} >
              <CardHeader title="Tambah Anggota">
                <CardHeaderToolbar>
                  <button
                      type="button"
                      className="btn btn-success mr-2"
                      onClick={() => {
                        // window.open()
                        setPreviousPage({ ...previousPage, redirect: true });
                      }}
                  >
                    Batal
                  </button>
                  <button
                      type="submit"
                      className="btn btn-primary mr-2"
                  >
                    Simpan
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group as={Row} controlId="name">
                      <Form.Label className="required" column sm={2}>
                        Nama
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="Nama"
                            name="name"
                            isInvalid={(formik.touched.name && formik.errors.name) || formErrors.name}
                            {...formik.getFieldProps("name")}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">{formik.errors.name}</div>
                            </div>
                        ) : null}
                        <ValidationAlert state={formErrors} stateKey="name" />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="nik">
                      <Form.Label className="required" column sm={2}>NIK</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="NIK"
                            name="nik"
                            disabled={props.readOnly}
                            isInvalid={(formik.touched.nik && formik.errors.nik || formErrors.nik)}
                            {...formik.getFieldProps("nik")}
                        />
                        {formik.touched.nik && formik.errors.nik ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">{formik.errors.nik}</div>
                            </div>
                        ) : null}
                        <ValidationAlert state={formErrors} stateKey="nik" />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="email">
                      <Form.Label column sm={2}>Email</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                            name="email"
                            type="text"
                            placeholder="Masukkan Email"
                            disabled={props.readOnly}
                            isInvalid={(formik.touched.email && formik.errors.email) || formErrors.email}
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">{formik.errors.email}</div>
                            </div>
                        ) : null}
                        <ValidationAlert state={formErrors} stateKey="email" />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="phone_number">
                      <Form.Label className="required" column sm={2}>Nomor HP</Form.Label>
                      <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Nomor HP"
                            name="phone_number"
                            disabled={props.readOnly}
                            isInvalid={(formik.touched.phone_number && formik.errors.phone_number) || formErrors.phone_number}
                            {...formik.getFieldProps("phone_number")}
                        />
                        {formik.touched.phone_number && formik.errors.phone_number ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">{formik.errors.phone_number}</div>
                            </div>
                        ) : null}
                        <ValidationAlert
                            state={formErrors}
                            stateKey="phone_number"
                        />
                      </Col>
                    </Form.Group>

                    {roleId == 0 ?
                        <Form.Group as={Row} controlId="parent">
                          <Form.Label className="required" column sm={2}>
                            Induk Olahraga
                          </Form.Label>
                          <Col sm={10}>
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
                          <ValidationAlert state={formErrors} stateKey="parent" />
                          </Col>
                          </Form.Group>
                    :null}

                    {roleId == 0 || roleId == 1 ?
                        <Form.Group as={Row} controlId="province">
                          <Form.Label className="required" column sm={2}>Provinsi</Form.Label>
                          <Col sm={10}>
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
                            <ValidationAlert state={formErrors} stateKey="province" />
                          </Col>
                        </Form.Group>
                    :null}

                    {roleId == 0 || roleId == 1 || roleId == 2 ?
                        <Form.Group as={Row} controlId="kota">
                          <Form.Label className="required" column={2}>
                            Kota
                          </Form.Label>
                          <Col sm={10}>
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
                            <ValidationAlert state={formErrors} stateKey="city" />
                          </Col>
                        </Form.Group>
                    :null}
                    <Form.Group as={Row} controlId='organitation_status'>
                      <Form.Label className="required" column sm={2}>Status Organisasi</Form.Label>
                      <Col sm={10}>
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
                        <ValidationAlert state={formErrors} stateKey="organitation_status_id" />
                      </Col>
                    </Form.Group>
                </div>
                </div>
              </CardBody>
            </Form>
          </Card>
        )}
      </>
  );
}

export default MemberCreate;