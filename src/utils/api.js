import axios from "axios";

axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        "Content-Type": "application/json"
    }
});

export const setAuth = sessionID => {
    api.defaults.headers.common["Authorization"] = sessionID;
};
