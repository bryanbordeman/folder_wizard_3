import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectTypeService {
    getTypes(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/types/`);
    };
    getType(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/type/${id}`);
    };
};
export default new ProjectTypeService();

