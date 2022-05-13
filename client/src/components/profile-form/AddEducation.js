import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddEducation = ({ addEducation }) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDisable, setToDisable] = useState(false);
  const { school, degree, fieldofstudy, from, to, current, description } =
    formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const navigate = useNavigate();

  return (
    <>
      <h1 className="large text-primary">Add An Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school/bootcamp that you
        have attended
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();

          addEducation(formData, navigate);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* School/Bootcamp"
            name="school"
            required
            value={school}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree/Certificate"
            name="degree"
            required
            value={degree}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Field of study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              value={toDisable}
              onChange={(e) => {
                setToDisable(!toDisable);
                // if (toDisable) {
                //   setFormData({ ...formData, current: !current, to: "" });
                // }else{}
                setFormData({ ...formData, current: !current });
              }}
            />{" "}
            Currently pursuing
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
            disabled={toDisable ? "disabled" : ""}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Education Description"
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
