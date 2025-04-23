import axios from "axios";
// import Cookies from "js-cookie";

let token = "";

// if (typeof window !== "undefined") {
//   token = Cookies.get("token");
// }

const axiosInstance = axios.create({
  baseURL: "http://10.81.100.141:9000/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
