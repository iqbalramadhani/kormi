import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {LayoutSplashScreen} from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    const { hasAuthToken } = this.props;
    console.log(hasAuthToken)
    return hasAuthToken ? 
      // <LayoutSplashScreen />
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 500)
      : <Redirect to="/auth/login" />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
