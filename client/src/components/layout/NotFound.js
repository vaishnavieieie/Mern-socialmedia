import React from "react";
import PropTypes from "prop-types";

const NotFound = (props) => {
  return (
    <>
      <h1
        className=" x-large text-primary"
        style={{ color: "red", textAlign: "center" }}
      >
        <i className="fas fa-exclamation-triangle"></i> Page Not Found
      </h1>
      <p style={{ textAlign: "center" }} className="">
        Sorry this page does not exist 🥺
      </p>
    </>
  );
};

NotFound.propTypes = {};

export default NotFound;
