import { useFormik } from "formik";
import React, { useState, useRef } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Card } from "../../../../_metronic/_partials/controls";
import ValidationAlert from "../../../components/ValidationAlert";
import ShowAlert from "../../../libs/ShowAlert";
import { AuthServices } from "../../../services";
import * as auth from "../_redux/authRedux";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  code: "",
  password: "",
  password_confirmation: "",
};

function ResetPassword(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const ResetPasswordSchema = Yup.object().shape({
    code: Yup.string().required("Code harus diisi"),
    password: Yup.string()
      .required("Password harus diisi")
      .min(8, "Minimum 8 karakter"),
    password_confirmation: Yup.string()
      .required("Konfirmasi password harus diisi")
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password dan Konfirmasi password tidak sama"
        ),
      }),
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

  const inputPasswordNew = useRef();
  const inputPasswordConfirm = useRef();
  
  const onShowPasswordNew = () => {
    if (inputPasswordNew.current.type === 'password') {
      inputPasswordNew.current.type = 'text'
      setShowNew(true)
    } else {
      inputPasswordNew.current.type = 'password'
      setShowNew(false)
    }
  }

  const onShowPasswordConfirm = () => {
    if (inputPasswordConfirm.current.type === 'password') {
      inputPasswordConfirm.current.type = 'text'
      setShowConfirm(true)
    } else {
      inputPasswordConfirm.current.type = 'password'
      setShowConfirm(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      resetPassword(values);
    },
  });

  const resetPassword = async (values) => {
    enableLoading();
    let { data, error } = await AuthServices.resetPassword(null, values);
    disableLoading();
    if (data) {
      props.login(data.auth.token);
      props.fulfillUser(data);
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      <Card style={{ padding: "20px" }}>
        <img
          src="/media/kormi/KORMI_Logo2.png"
          alt="Kormiapps Dashboard"
          style={{ width: '160px', height: '43px', margin: "auto", marginBottom: "20px" }}
        />
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">Reset Password</h3>
          <p className="text-muted font-weight-bold">Enter your new password</p>
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

          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Code"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "text"
              )}`}
              name="code"
              {...formik.getFieldProps("code")}
            />
            {formik.touched.code && formik.errors.code ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.code}</div>
              </div>
            ) : null}
            <ValidationAlert state={errors} stateKey="code" />
          </div>
          <div className="form-group fv-plugins-icon-container">
          <div style={{position: 'relative'}}>
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
              ref={inputPasswordNew}
            />
            <i style={{top: '1.3rem'}} className={showNew ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPasswordNew}></i>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
            <ValidationAlert state={errors} stateKey="password" />
          </div>
          <div className="form-group fv-plugins-icon-container">
          <div style={{position: 'relative'}}>
            <input
              placeholder="Konfirmasi Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password_confirmation"
              )}`}
              name="password_confirmation"
              {...formik.getFieldProps("password_confirmation")}
              ref={inputPasswordConfirm}
            />
            <i style={{top: '1.3rem'}} className={showConfirm ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPasswordConfirm}></i>
          </div>
            {formik.touched.password_confirmation &&
            formik.errors.password_confirmation ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.password_confirmation}
                </div>
              </div>
            ) : null}
            <ValidationAlert state={errors} stateKey="password_confirmation" />
          </div>
          <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
            <Link
              to="/auth/login"
              className="text-dark-50 text-hover-primary my-3 mr-2"
              id="kt_login_forgot"
            >
              Login
            </Link>
            <button
              id="kt_login_signin_submit"
              type="submit"
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
              disabled={loading}
            >
              <span>Reset Password</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </Card>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(ResetPassword));
