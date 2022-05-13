import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({
  education: { school, degree, current, fieldofstudy, to, from, description },
}) => {
  return (
    <div>
      <h3 class="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
        {to ? <Moment format="YYYY/MM/DD">{to}</Moment> : "Now"}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field os Study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description ? <>{description}</> : <h4>No description</h4>}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
