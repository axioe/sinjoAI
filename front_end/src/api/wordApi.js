import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getRank = () => API.get("/rank");

export const getTodayWord = () => API.get("/today");

export const getQuiz = () => API.get("/quiz");
