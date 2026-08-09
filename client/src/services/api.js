import axios from "axios";

const api = axios.create({
    baseURL: "https://billora-api-jq5a.onrender.com/api"
});

export default api;