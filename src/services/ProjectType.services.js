import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectTypeService {
    getTypes(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/types/`);
    };
};
export default new ProjectTypeService();

