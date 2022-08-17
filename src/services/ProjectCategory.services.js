import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectCategoryService {
    getCategories(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/categories/`);
    };
};
export default new ProjectCategoryService();

