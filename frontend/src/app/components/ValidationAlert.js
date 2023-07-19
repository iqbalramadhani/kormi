import React from "react";

const ValidationAlert = (props) => {
  return (
    <>
      {props.state &&
        props.state[props.stateKey] &&
        <>
          {Array.isArray(props.state[props.stateKey]) ? props.state[props.stateKey].map((err) => (
            <p className="text-danger">{err}</p>
          ))
            :
            <p className="text-danger">{props.state[props.stateKey]}</p>
          }
        </>
      }
    </>
  );
};

export default ValidationAlert;
