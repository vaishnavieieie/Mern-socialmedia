import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
  experience: { company, title, current, to, from, description },
}) => {
  return (
    <div>
      <h3 class="text-dark">{company}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
        {to ? <Moment format="YYYY/MM/DD">{to}</Moment> : "Now"}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description ? <>{description}</> : <h4>No description</h4>}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {};

export default ProfileExperience;
