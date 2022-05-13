import React from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./components/layout/Alert";
import { useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile.js";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/layout/NotFound";
import Routess from "./components/routing/Routess";

// import setAuthToken from "./utils/setAuthToken";
import { setAuthTokens } from "./util/setAuthToken";

//redux
import { Provider } from "react-redux";
import store from "./store";
import { loaduser } from "./actions/auth";

if (localStorage.token) {
  setAuthTokens(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loaduser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
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
            <Route
              path="/posts/:id"
              element={<PrivateRoute element={Post} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* <PrivateRoute path="/dashboard" element={<Dashboard />} /> */}
        </section>
      </Router>
    </Provider>
  );
};

export default App;
