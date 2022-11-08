import axios from "axios";
import { SERVER } from "./SERVER";

class CompanyDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/companies/`);
    };
    searchAll(token, search){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/companies/?search=${search}`);
    };
    getAllShort(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/companies/short/`);
    };
    createCompany(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/company/`, data);
    };
    updateCompany(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/company/${id}`, data);
    };
    updateCompanyShort(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/company/short/${id}`, data);
    };
    getCompanyShort(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/company/short/${id}`);
    };
    deleteCompany(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/company/${id}`);
    };
}

export default new CompanyDataService();