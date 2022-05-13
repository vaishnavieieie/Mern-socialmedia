import React from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ element: Element, path, auth, ...rest }) => {
  // <Route
  //   {...rest}
  //   render={(props) =>
  //     !auth.isAuthenticated && !auth.loading ? (
  //       Element(<Navigate to="/login" />)
  //     ) : (
  //       <Element {...props} />
  //     )
  //   }
  // ></Route>;
  // console.log(Element);
  // if (!auth.isAuthenticated && !auth.loading) {
  //   return <Navigate to="/login" />;
  // } else {
  //   return (
  //     <Routes>
  //       <Route exact path={path} element={Element} />;
  //     </Routes>
  //   );
  // }
  if (!auth.loading && auth.isAuthenticated) return <Element />;
  else if (!auth.loading && !auth.isAuthenticated)
    return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
