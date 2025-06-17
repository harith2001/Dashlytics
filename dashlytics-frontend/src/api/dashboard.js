import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||"http://localhost:8080/api/v1";

console.log("API_BASE_URL", API_BASE_URL);

//limit can be changed to get more data

export const getCountryRevenue = () => 
    axios.get(`${API_BASE_URL}/country-revenue`)  

export const getTopProducts = () =>
    axios.get(`${API_BASE_URL}/top-products`)  

export const getMonthlySales = () =>
    axios.get(`${API_BASE_URL}/monthly-sales`)

export const getTopRegions = () =>
    axios.get(`${API_BASE_URL}/top-regions`)

