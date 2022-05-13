import { connect } from "react-redux";
import Moment from "react-moment";
import React from "react";
import PropTypes from "prop-types";
import { deleteEducation } from "../../actions/profile";
const Education = ({ education, deleteEducation }) => {
  console.log(education);
  var education1 = "";
  if (education) {
    education1 = education.map((edu) => (
      <tr key={edu.id}>
        <td>{edu.school}</td>
        <td className="hide-sm">{edu.degree}</td>
        <td className="hide-sm">
          <Moment format="YYYY/MM/DD">{edu.from}</Moment>-{""}
          {edu.to == null ? (
            "Now"
          ) : (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={() => deleteEducation(edu.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree/Certificate</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>
        <tbody>{education1}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
