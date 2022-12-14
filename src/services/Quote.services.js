import axios from "axios";
import { SERVER } from "./SERVER";

class QuoteDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/quotes/`);
    };
    getAllYear(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/quotes/${year}`);
    };
    getAllArchive(year,token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/quotes/archive/${year}`);
    };
    toggleArchive(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/quote/${id}/togglearchive/`);
    };
    getNextQuoteNumber(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/next/quote/`);
    };
    getLastQuote(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/last/quote/`);
    };
    createQuote(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/quote/`, data);
    };
    getQuote(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/quote/${id}`);
    };
    updateQuote(id, data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`${SERVER}/api/quote/${id}`, data);
    };
    deleteQuote(id, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`${SERVER}/api/quote/${id}`);
    };
}

export default new QuoteDataService();