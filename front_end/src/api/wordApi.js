import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getTrend = () => API.get("/trend");

export const getTodayWord = () => API.get("/today");

export const getQuiz = () => API.get("/quiz");
