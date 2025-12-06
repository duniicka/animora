import axios from "axios";
import { API_BASE_URL } from "./api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { "api-key": "code_academy" },
});

const getAccessToken = () => localStorage.getItem("token");

instance.interceptors.request.use(
  function (config) {
    const token = getAccessToken(); // or however you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;