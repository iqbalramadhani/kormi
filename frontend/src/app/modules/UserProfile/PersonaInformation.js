import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import ValidationAlert from "../../components/ValidationAlert";
import ShowAlert from "../../libs/ShowAlert";
import uploadFileToBase64 from "../../libs/uploadFileToBase64";
import { ProfileServices } from "../../services";
import * as auth from "../Auth";
import { useHistory } from 'react-router-dom'

function PersonaInformation(props) {
  const dispatch = useDispatch();
  
  const [pic, setPic] = useState("none");
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const history = useHistory();

  const getUser = async (isDispatch = false) => {
    let { data, error } = await ProfileServices.getProfile();
    if (data) {
      setUser(data);
      if (data.avatar) setPic(`url(${data.avatar})`);
      if (isDispatch) {
        dispatch(props.setUser(data));
      }
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getUser(true);
  }, []);
  // Methods
  const saveUser = async () => {
    delete user.avatar;
    let { data, error } = await ProfileServices.updateProfile(user);
    if (data) {
      if (avatar !== "") {
        let responseAvatar = await ProfileServices.updateAvatar({ avatar });
        if (responseAvatar.data) {
          getUser(true);
          setPic(`url(${responseAvatar.data.avatar})`);
        }
        if (responseAvatar.error) {
          if (responseAvatar.error.message)
          ShowAlert.failed(responseAvatar.error.message);
        }
        ShowAlert.created();
        history.push('/user-profile');
        emptyCache();
      } else {
        getUser(true);
        history.push('/user-profile');
        ShowAlert.created();
      } 
    }
    if (error) {
      // if (error.message) ShowAlert.failed(error.message);
      setErrors(error);
    }
  };

  const emptyCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
      window.location.reload(true);
    }
  }

  const handleUploadFile = async (e) => {
    const file = e.target.files;
    const base64Files = await uploadFileToBase64(file);
    console.log(file, base64Files);

    const allowedExtensions = ['jpg', 'png', 'jpeg'];
    let check = allowedExtensions.some(ext => file[0].name.includes(ext));
    if (!file[0].type.includes('image/')) {
      ShowAlert.failed('File selain gambar tidak diperbolehkan');
      return;
    } else if (!check) {
      ShowAlert.failed('Silakan unggah file dalam format .jpg, .png, atau .jpeg');
      return;
    } else if (file[0].size > 2000000) {
      ShowAlert.failed('Ukuran gambar maksimal 2 MB');
      return;
    } else {
      setPic(`url(${URL.createObjectURL(file[0])})`);
      setAvatar(base64Files[0]);
    }

  };

  const removePic = () => {
    setAvatar("");
    setPic("none");
  };

  const handleChanges = (e) => {
    const newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      saveUser();
    }
  };

  return (
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="card card-custom" 
      >
        {/* begin::Header */}
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <h3 className="card-label font-weight-bolder text-dark">
              Data diri
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Perbarui data diri Anda
            </span>
          </div>
          <div className="card-toolbar">
            <Button type="submit" className="btn btn-success mr-2">
              Simpan
            </Button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Form */}
        <div className="form">
          {/* begin::Body */}
          <div className="card-body">
            <div className="row">
              <label className="col-xl-3"></label>
              <div className="col-lg-9 col-xl-6">
                <h5 className="font-weight-bold mb-6">Customer Info</h5>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
              <div className="col-lg-9 col-xl-6">
                <div
                  className="image-input image-input-outline"
                  id="kt_profile_avatar"
                  style={{
                    backgroundImage: `url(${toAbsoluteUrl(
                      "/media/users/blank.png"
                    )}`,
                  }}
                >
                  <div
                    className="image-input-wrapper"
                    style={{ backgroundImage: `${pic}` }}
                  />
                  <label
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="change"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Change avatar"
                  >
                    <i className="fa fa-pen icon-sm text-muted"></i>
                    <input
                      type="file"
                      // name="pic"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => {
                        handleUploadFile(e);
                      }}
                    />
                    <input type="hidden" name="profile_avatar_remove" />
                  </label>
                  <span
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="cancel"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Cancel avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span>
                  <span
                    onClick={removePic}
                    className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                    data-action="remove"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Remove avatar"
                  >
                    <i className="ki ki-bold-close icon-xs text-muted"></i>
                  </span>
                </div>
                <span className="form-text text-muted">
                  Allowed file types: png, jpg, jpeg.
                </span>
              </div>
            </div>
            <Form.Group as={Row}>
              <Form.Label column xl="3" lg="3">
                Nama
              </Form.Label>
              <Col xl="6" lg="9">
                <Form.Control
                  name="name"
                  defaultValue={user.name}
                  placeholder="Masukkan Nama"
                  onChange={(e) => handleChanges(e)}
                  required
                />
                <ValidationAlert state={errors} stateKey="name" />
                <Form.Control.Feedback type="invalid">
                  Masukkan Nama
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {/* <div className="row">
              <label className="col-xl-3"></label>
              <div className="col-lg-9 col-xl-6">
                <h5 className="font-weight-bold mt-10 mb-6">Contact Info</h5>
              </div>
            </div> */}
            <Form.Group as={Row}>
              <Form.Label column xl="3" lg="3">
                Nomor Handphone
              </Form.Label>
              <Col xl="6" lg="9">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">
                      <i className="fa fa-phone"></i>
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name="phone_number"
                    defaultValue={user.phone_number}
                    placeholder="081111111"
                    onChange={(e) => handleChanges(e)}
                    required
                  />
                  <ValidationAlert state={errors} stateKey="phone_number" />
                  <Form.Control.Feedback type="invalid">
                    Masukkan Nomor Handphone
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column xl="3" lg="3">
                Email
              </Form.Label>
              <Col xl="6" lg="9">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">
                      <i className="fa fa-at"></i>
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name="email"
                    defaultValue={user.email}
                    placeholder="081111111"
                    onChange={(e) => handleChanges(e)}
                    required
                  />
                  <ValidationAlert state={errors} stateKey="email" />
                  <Form.Control.Feedback type="invalid">
                    Masukkan Email
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
          </div>
          {/* end::Body */}
        </div>
        {/* end::Form */}
      </Form>
  );
}

export default connect(null, auth.actions)(PersonaInformation);
