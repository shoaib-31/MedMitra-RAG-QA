import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;
