import axios from "axios";

export const setAuthTokens = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"]; //removes a property from an object
  }
};
