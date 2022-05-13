import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import PropTypes from "prop-types";

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard"></Navigate>;
  }

  const onchange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onsubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));

    console.log("Success");
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onsubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onchange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onchange(e)}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
