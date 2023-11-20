import axios from 'axios';

const APIInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

APIInstance.interceptors.request.use(config => {
    const authToken = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
});

export default APIInstance;