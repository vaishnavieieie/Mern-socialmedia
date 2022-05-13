import React from "react";

import Register from "../auth/Register";
import Login from "../auth/Login";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import CreateProfile from "../profile-form/CreateProfile";
import EditProfile from "../profile-form/EditProfile.js";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import AddExperience from "../profile-form/AddExperience";
import AddEducation from "../profile-form/AddEducation";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../layout/NotFound";

const Routess = (props) => {
  return (
    <>
      <section className="container">
        <Alert />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profiles" element={<Profiles />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route
            exact
            path="/create-profile"
            element={<PrivateRoute element={CreateProfile} />}
          />
          <Route
            path="dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route
            path="/edit-profile"
            element={<PrivateRoute element={EditProfile} />}
          />
          <Route
            path="/add-experience"
            element={<PrivateRoute element={AddExperience} />}
          />
          <Route
            path="/add-education"
            element={<PrivateRoute element={AddEducation} />}
          />

          <Route path="/posts" element={<PrivateRoute element={Posts} />} />
          <Route path="/posts/:id" element={<PrivateRoute element={Post} />} />
          <Route element={<NotFound />} />
        </Routes>
        {/* <PrivateRoute path="/dashboard" element={<Dashboard />} /> */}
      </section>
    </>
  );
};

Routess.propTypes = {};

export default Routess;
