import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectBillingTypeService {
    getTypes(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/billings/`);
    };
};
export default new ProjectBillingTypeService();

