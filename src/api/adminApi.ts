import axios from 'axios';

const AdminAPIInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + 'admin/',
});

AdminAPIInstance.interceptors.request.use(config => {
  const authToken = localStorage.getItem('adminToken');
  const role = localStorage.getItem('adminRole');
  config.headers.Authorization = `Bearer ${authToken}`;
  config.headers.role = role;
  return config;
});

export default AdminAPIInstance;