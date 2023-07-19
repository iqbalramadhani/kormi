import React from "react";
import {Route, Redirect} from "react-router-dom";
import {Content} from "./Content";
import { useSelector, shallowEqual } from "react-redux";

export function ContentRoute({ children, component, render, ...props }) {
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role.toString();

  if (props.role !== undefined) {
    // split role delimited with comma or comma with an extra space
    props.role = props.role.split(/[ ,]+/); 
  }

  return (
    <Route {...props}>
      {routeProps => {
        if (typeof children === "function") {
          return <Content>{children(routeProps)}</Content>;
        }

        // redirect to dashboard if role doesn't includes in array of roles from props
        if (props.role !== undefined && !props.role.includes(roleId)) {
          return <Redirect to='/dashboard' /> 
        }

        if (!routeProps.match) {
          return null;
        }

        if (children) {
          return <Content>{children}</Content>;
        }

        if (component) {
          return (
            <Content>{React.createElement(component, routeProps)}</Content>
          );
        }

        if (render) {
          return <Content>{render(routeProps)}</Content>;
        }

        return null;
      }}
    </Route>
  );
}
