// src/services/api.ts
import axios from "axios";
console.log("port",import.meta.env.VITE_API_URL);
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

axios.interceptors.response.use(
  (res) => {
      if (res.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data["accessToken"]}`;

      }
    return res
  },(err) =>{
    return Promise.reject(err);
  }
);