import axios from 'axios';
import { Platform } from 'react-native';

const IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_URL = `http://${IP}:3000/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
