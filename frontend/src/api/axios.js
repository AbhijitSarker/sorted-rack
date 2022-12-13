import axios from "axios";
const axiosSecure = axios.create({
  baseURL: "https://apisortedrack.managedcoder.com/api/st/",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`
  }
});


const axiosOpen = axios.create({
  baseURL: "https://apisortedrack.managedcoder.com/api/st/",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



export { axiosSecure, axiosOpen };