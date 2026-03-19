import axios from "axios"
import { camelizeKeys, decamelizeKeys } from "humps";

const apiUrl = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: apiUrl
})

api.interceptors.request.use((config) => {
  if (config.data) {
    config.data = decamelizeKeys(config.data);
  }
  console.log(config.data)
  return config;
});

api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

export default api;