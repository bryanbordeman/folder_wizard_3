import axios from "axios";
import { SERVER } from "./SERVER";

class UserService {
    getUsers(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/users/`);
    };
    login(data){
        return axios.post(`${SERVER}/api/login/`, data);
    };
    signup(data){
        return axios.post(`${SERVER}/api/signup/`, data);
    };
}

export default new UserService();