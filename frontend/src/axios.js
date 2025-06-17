import axios from 'axios';

const instance = axios.create({
  baseURL:'http://localhost:4000/api',
  withCredentials: true, // required if using cookies for auth
});

export default instance;
