import axios from "axios";
import { message } from 'antd';
import { receiveErrMessage } from '../App';

const apiURIScheme = "http://localhost:6050/";

export default {
  send: async (url, req, type = "post") => {
    const requestUrl = apiURIScheme + url;
    console.log("URL :", requestUrl);
    console.log("TYPE:", type);

    return await axios.post(requestUrl, req).then(re => re).catch(({ response }) => {
      const { data } = response;

      if (data.status === 'error') {
        const msg = `API URI: ${url} ERROR NAME: ${data.message}`;

        receiveErrMessage(msg);

        message.error(msg);
      }
    })
  },
};