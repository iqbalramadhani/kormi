import { useFormik } from "formik";
import React, { useState, useRef } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Card
} from "../../../../_metronic/_partials/controls";
import { login } from "../_redux/authCrud";
import * as auth from "../_redux/authRedux";
import { AuthServices } from '../../../services'
import ShowAlert from "../../../libs/ShowAlert";
import ValidationAlert from "../../../components/ValidationAlert";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: "",
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false)
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email salah")
      .required("Email tidak boleh kosong"),
    password: Yup.string()
      .min(8, "Password minimal 8 karakter")
      .required("Password tidak boleh kosong"),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const inputPassword = useRef()
  
  const onShowPassword = () => {
    if (inputPassword.current.type === 'password') {
      inputPassword.current.type = 'text'
      setShow(true)
    } else {
      inputPassword.current.type = 'password'
      setShow(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      enableLoading();
      const {data, error} = await AuthServices.login({
        email: values.email, 
        password: values.password
      });
      if (data) {
        disableLoading();
        props.login(data.auth.token);
        props.fulfillUser(data);            
      }
      if (error) {
        disableLoading();
        setSubmitting(false);
        setStatus(
          'Data login salah'
        );
        setErrors(error)
        if (error.message) ShowAlert.failed(error.message);
      }
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      <Card style={{padding: '20px'}}>
      <img
        src="/media/kormi/KORMI_Logo2.png"
        alt="Kormiapps Dashboard"
        style={{width: '160px', height: '43px', margin: 'auto', marginBottom: '20px'}}
      />
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          Login
        </h3>
        <p className="text-muted font-weight-bold">
          Masukkan email dan password
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : null}
        <ValidationAlert state={errors} stateKey="error" />

        <div className="form-group fv-plugins-icon-container">
          <label for="email">Email</label>
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
          <ValidationAlert state={errors} stateKey="email" />
        </div>
        <div className="form-group fv-plugins-icon-container">
          <div style={{position: 'relative'}}>
            <label for="password">Password</label>
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
              ref={inputPassword}
            />
            <i className={show ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPassword}></i>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
          <ValidationAlert state={errors} stateKey="password" />
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            Lupa Password
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={loading}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Masuk</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
      </Card>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
