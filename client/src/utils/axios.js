import axios from "axios";

//The API cloud function URL
const instance = axios.create({
    baseURL: "http://localhost:2000/api", //dev
    // baseURL: "https://us-central1-clone-3afbe.cloudfunctions.net/api", //prod
});

export default instance;