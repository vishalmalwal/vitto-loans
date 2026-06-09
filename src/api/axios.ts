import axios from "axios";

// Create Axios instance pointing to local /api base path relative to the current origin
const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
