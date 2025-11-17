import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
};

const axiosClient = axios.create(options);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { data, status } = error.response || {};
    return Promise.reject({ ...data });
  }
);

export default axiosClient;
