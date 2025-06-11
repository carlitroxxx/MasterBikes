import axios from 'axios';

const API_URL = 'http://localhost:8082/arriendos';

export const solicitarArriendo = async (data) => {
    return await axios.post(API_URL, data);
};