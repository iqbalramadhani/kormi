/* eslint-disable jsx-a11y/anchor-is-valid */
import { useFormik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import SVG from "react-inlinesvg";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import ValidationAlert from "../../components/ValidationAlert";
import ShowAlert from "../../libs/ShowAlert";
import { ProfileServices } from "../../services";
import * as auth from "../Auth";

function ChangePassword(props) {
  // Fields
  const [loading, setloading] = useState(false);
  const [isError, setisError] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user, shallowEqual);
  useEffect(() => {}, [user]);
  // Methods
  const updatePassword = async (values, setStatus, setSubmitting, resetForm) => {
    let { data, error } = await ProfileServices.changePassword(null, values);
    if (data) {
      ShowAlert.updated('Password Updated');
      resetForm()
    }
    if (error) {
      setErrors(error)
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  const inputPasswordNew = useRef();
  const inputPasswordOld = useRef();
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
  const onShowPasswordOld = () => {
    if (inputPasswordOld.current.type === 'password') {
      inputPasswordOld.current.type = 'text'
      setShowOld(true)
    } else {
      inputPasswordOld.current.type = 'password'
      setShowOld(false)
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

  // UI Helpers
  const initialValues = {
    old_password: "",
    password: "",
    password_confirmation: "",
  };
  const Schema = Yup.object().shape({
    old_password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .required("Password lama harus diisi"),
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .required("Password harus diisi"),
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
    validationSchema: Schema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      updatePassword(values, setStatus, setSubmitting, resetForm);
    },
  });

  return (
    <form className="card card-custom" onSubmit={formik.handleSubmit}>
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            Ubah Password
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            Ubah password Anda
          </span>
        </div>
        <div className="card-toolbar">
          <button
            type="submit"
            className="btn btn-success mr-2"
          >
            Simpan
            {formik.isSubmitting}
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        <div className="card-body">
          {/* begin::Alert */}
          {isError && (
            <div
              className="alert alert-custom alert-light-danger fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                  ></SVG>{" "}
                </span>
              </div>
              <div className="alert-text font-weight-bold">
                Configure user passwords to expire periodically. Users will need
                warning that their passwords are going to expire,
                <br />
                or they might inadvertently get locked out of the system!
              </div>
              <div className="alert-close" onClick={() => setisError(false)}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i className="ki ki-close"></i>
                  </span>
                </button>
              </div>
            </div>
          )}
          {/* end::Alert */}
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Password Lama
            </label>
            <div className="col-lg-9 col-xl-6">
            <div style={{position: 'relative'}}>
              <input
                type="password"
                placeholder="Current Password"
                className={`form-control form-control-lg form-control-solid mb-2 ${getInputClasses(
                  "old_password"
                )}`}
                name="old_password"
                {...formik.getFieldProps("old_password")}
                ref={inputPasswordOld}
              />
              <i style={{top: '0.9rem'}} className={showOld ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPasswordOld}></i>
              {formik.touched.old_password &&
              formik.errors.old_password ? (
                <div className="invalid-feedback">
                  {formik.errors.old_password}
                </div>
              ) : null}
              <ValidationAlert state={errors} stateKey="old_password" />
            </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Password Baru
            </label>
            <div className="col-lg-9 col-xl-6">
            <div style={{position: 'relative'}}>
              <input
                type="password"
                placeholder="New Password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password"
                )}`}
                name="password"
                {...formik.getFieldProps("password")}
                ref={inputPasswordNew}
              />
              <i style={{top: '0.9rem'}} className={showNew ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPasswordNew}></i>
              {formik.touched.password && formik.errors.password ? (
                <div className="invalid-feedback">{formik.errors.password}</div>
              ) : null}
              <ValidationAlert state={errors} stateKey="password" />
            </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Konfirmasi Password
            </label>
            <div className="col-lg-9 col-xl-6">
            <div style={{position: 'relative'}}>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password_confirmation"
                )}`}
                name="password_confirmation"
                ref={inputPasswordConfirm}
                {...formik.getFieldProps("password_confirmation")}
              />
              <i style={{top: '0.9rem'}} className={showConfirm ? 'fa fa-eye show-hide-pw' : 'fa fa-eye-slash show-hide-pw'} onClick={onShowPasswordConfirm}></i>
              {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                <div className="invalid-feedback">
                  {formik.errors.password_confirmation}
                </div>
              ) : null}
              <ValidationAlert state={errors} stateKey="password_confirmation" />
            </div>
            </div>
          </div>
        </div>
      </div>
      {/* end::Form */}
    </form>
  );
}

export default connect(null, auth.actions)(ChangePassword);
