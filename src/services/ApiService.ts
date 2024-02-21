import axios from 'axios';
import { flightsList, removeObjectWithId, setFlightList } from '../flightsUtils';

const BASE_URL = 'http://localhost:5555'; // Replace with your server URL

export const uploadFlightData = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFlights = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-flights`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const deleteFlight = async (data: any) => {
  try {
    const dataToSend = {
      "flightId":data
    }
    const response = await axios.post(`${BASE_URL}/delete-flight`, dataToSend);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLocationDetailsByLonLat = async (longitude:number, latitude:number) => {
    try {
    const response = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
    return response;
  } catch (error) {
    throw error;
  }
}