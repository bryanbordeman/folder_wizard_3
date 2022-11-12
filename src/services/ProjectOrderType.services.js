import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectOrderTypeService {
    getTypes(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/orders/`);
    };
};
export default new ProjectOrderTypeService();

