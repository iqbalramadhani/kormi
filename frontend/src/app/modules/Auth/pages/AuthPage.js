/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {Link, Switch, Redirect} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import {ContentRoute} from "../../../../_metronic/layout"
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";

export function AuthPage() {
  return (
      <>
        <div className="d-flex flex-column flex-root">
          {/*begin::Login*/}
          <div
              className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid"
              id="kt_login"
          >
            {/*begin::Content*/}
            <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
              {/*begin::Content header*/}
              {/*end::Content header*/}

              {/* begin::Content body */}
              <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
                <Switch>
                <ContentRoute path="/auth/login" component={Login}/>
                <ContentRoute path="/auth/registration" component={Registration}/>
                <ContentRoute
                    path="/auth/forgot-password"
                    component={ForgotPassword}
                />
                 <ContentRoute
                  path="/auth/reset-password"
                  component={ResetPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login"/>
                <Redirect to="/auth/login"/>
              </Switch>
              </div>
              {/*end::Content body*/}

              {/* begin::Mobile footer 
              <div
                  className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
                <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                  &copy; 2020 Metronic
                </div>
                <div className="d-flex order-1 order-sm-2 my-2">
                  <Link to="/terms" className="text-dark-75 text-hover-primary">
                    Privacy
                  </Link>
                  <Link
                      to="/terms"
                      className="text-dark-75 text-hover-primary ml-4"
                  >
                    Legal
                  </Link>
                  <Link
                      to="/terms"
                      className="text-dark-75 text-hover-primary ml-4"
                  >
                    Contact
                  </Link>
                </div>
              </div>
               end::Mobile footer */}
            </div>
            {/*end::Content*/}
          </div>
          {/*end::Login*/}
        </div>
      </>
  );
}
