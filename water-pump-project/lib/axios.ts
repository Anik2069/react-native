import axios from "axios";
// import Cookies from "js-cookie";

let token = "";

// if (typeof window !== "undefined") {
//   token = Cookies.get("token");
// }

const axiosInstance = axios.create({
    baseURL: "http://103.115.255.11:8080/user_api",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

export default axiosInstance;