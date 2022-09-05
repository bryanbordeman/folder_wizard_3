import axios from "axios";
import { SERVER } from "./SERVER";

class AddressDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/addresses/`);
    };
    lookup(placeId, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/address/lookup/${placeId}`);
    };
    createAddress(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/address/`, data);
    };
    updateAddress(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/address/${id}`, data);
    };
    deleteAddress(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/address/${id}`);
    };
}

export default new AddressDataService();