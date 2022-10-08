import axios from "axios";
import { SERVER } from "./SERVER";

class ContactDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/contacts/`);
    };
    getContactCompany(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/contact/company/${id}`);
    };
    getContacQuote(token, id){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/contact/quote/${id}`);
    };
    createContact(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/contact/`, data);
    };
    updateContact(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/contact/${id}`, data);
    };
    deleteContact(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/contact/${id}`);
    };
}

export default new ContactDataService();