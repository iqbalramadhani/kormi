import { useFormik } from "formik";
import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { Card } from "../../../../_metronic/_partials/controls";
import ValidationAlert from "../../../components/ValidationAlert";
import ShowAlert from "../../../libs/ShowAlert";
import { AuthServices } from "../../../services";
import * as auth from "../_redux/authRedux";

const initialValues = {
  email: "",
};

function ForgotPassword(props) {
  const { intl } = props;
  const [isRequested, setIsRequested] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email tidak boleh kosong"),
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

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      requestPassword(values);
    },
  });

  const requestPassword = async (values) => {
    enableLoading();
    let { data, error } = await AuthServices.forgotPassword(null, values);
    disableLoading()
    if (data) {
      setIsRequested(true);
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  return (
    <>
      {isRequested && <Redirect to="/auth/reset-password" />}
      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <Card style={{ padding: "20px" }}>
            <img
              src="/media/kormi/KORMI_Logo2.png"
              alt="Kormiapps Dashboard"
              style={{
                width: '160px', height: '43px',
                margin: "auto",
                marginBottom: "20px",
              }}
            />
            <div className="text-center mb-10 mb-lg-20">
              <h3 className="font-size-h1">Lupa Password?</h3>
              <div className="text-muted font-weight-bold">
                Masukkan email untuk reset password
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
            >
              {formik.status && (
                <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                  <div className="alert-text font-weight-bold">
                    {formik.status}
                  </div>
                </div>
              )}
              <div className="form-group fv-plugins-icon-container">
                <input
                  type="email"
                  placeholder="Email"
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
              <div className="form-group d-flex flex-wrap flex-center">
                <button
                  id="kt_login_forgot_submit"
                  type="submit"
                  className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                  disabled={loading}
                >
                  Kirim
                  {loading && <span className="ml-3 spinner spinner-white"></span>}
                </button>
                <Link to="/auth">
                  <button
                    type="button"
                    id="kt_login_forgot_cancel"
                    className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                  >
                    Batal
                  </button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
