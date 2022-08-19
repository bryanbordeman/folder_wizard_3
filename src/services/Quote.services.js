import axios from "axios";
import { SERVER } from "./SERVER";

class QuoteDataService {
    getAll(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/quotes/`);
    };
    getNextQuoteNumber(token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get(`${SERVER}/api/next/quote/`);
    };
    createQuote(data, token){
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post(`${SERVER}/api/create/quote/`, data);
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