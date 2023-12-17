import axios from 'axios';

const AdminAPIInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + 'admin/',
});

AdminAPIInstance.interceptors.request.use(config => {
  const authToken = localStorage.getItem('adminToken');
  config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export default AdminAPIInstance;