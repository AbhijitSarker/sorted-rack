import axios from "axios";

const userToken = localStorage.userDetails && JSON.parse(localStorage.userDetails).token;

const axiosSecure = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${userToken}`
  }
});

const axiosOpen = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



export { axiosSecure, axiosOpen };