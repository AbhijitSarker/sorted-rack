import axios from "axios";

export const getUserToken = () => localStorage.getItem("userDetails")
  ? JSON.parse(localStorage.getItem("userDetails")).token
  : null;

export const getAuthorizationHeader = () => `Bearer ${getUserToken()}`;

export const axiosSecure = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': getAuthorizationHeader()
  }
});

export const axiosOpen = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
