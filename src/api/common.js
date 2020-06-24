import axios from "axios";

const apiURIScheme = "http://localhost:6050/";

export default {
  send: (url, req, type = "post") => {
    url = apiURIScheme + url;
    console.log("URL :", url);
    console.log("TYPE:", type);

    return type === "post" ? axios.post(url, req) : axios.get(url, req);
  },
};
