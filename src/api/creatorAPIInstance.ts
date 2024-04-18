import axios from "axios";

const CreatorAPIInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "creator/",
});

CreatorAPIInstance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("creatorToken");
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export default CreatorAPIInstance;
