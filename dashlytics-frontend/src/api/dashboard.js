import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

//limit can be changed to get more data

export const getCountryRevenue = (limit) => 
    axios.get(`${API_BASE_URL}/api/v1/country-revenue?limit=${limit || 10}`)  

export const getTopProducts = () =>
    axios.get(`${API_BASE_URL}/api/v1/top-products`)  

export const getMonthlySales = (sortField, sortOrder) =>
    axios.get(`${API_BASE_URL}/api/v1/monthly-sales?sortField=${sortField || 'month'}&sortOrder=${sortOrder || 'asc'}`)

export const getTopRegions = (limit) =>
    axios.get(`${API_BASE_URL}/api/v1/top-regions?limit=${limit || 30}`)

