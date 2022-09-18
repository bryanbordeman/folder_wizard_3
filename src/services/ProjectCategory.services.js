import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectCategoryService {
    getCategories(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/categories/`);
    };
    getCategory(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/category/${id}`);
    };
};
export default new ProjectCategoryService();

