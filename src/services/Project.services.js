import axios from "axios";
import { SERVER } from "./SERVER";

class ProjectDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/projects/`);
    };
    getAllYear(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/projects/${year}`);
    };
    getAllArchive(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/projects/archive/${year}`);
    };
    toggleArchive(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/project/${id}/togglearchive/`);
    };
    getNextProjectNumber(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/next/project/`);
    };
    getLastProject(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/last/project/`);
    };
    createProject(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/project/`, data);
    };
    getProject(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/project/${id}`);
    };
    updateProject(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/project/${id}`, data);
    };
    deleteProject(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/project/${id}`);
    };
    getAllServices(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/services/`);
    };
    getAllYearServices(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/services/${year}`);
    };
    getAllArchiveServices(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/services/archive/${year}`);
    };
    toggleArchiveServices(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/service/${id}/togglearchive/`);
    };
    createService(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/service/`, data);
    };
    getService(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/service/${id}`);
    };
    updateService(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/service/${id}`, data);
    };
    deleteService(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/service/${id}`);
    };
    getAllHSEs(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/hses/`);
    };
    getAllYearHSEs(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/hses/${year}`);
    };
    getAllArchiveHSEs(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/hses/archive/${year}`);
    };
    toggleArchiveHSEs(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/hse/${id}/togglearchive/`);
    };
    getHSE(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/hse/${id}`);
    };
    updateHSE(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/hse/${id}`, data);
    };
    deleteHSE(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/hse/${id}`);
    };
}

export default new ProjectDataService();