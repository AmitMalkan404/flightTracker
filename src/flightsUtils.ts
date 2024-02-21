import { getAllFlights } from './services/ApiService';
import {FlightDataInterface} from './interfaces/flightDataInterface'

export let flightsList:FlightDataInterface[] = []

export const setFlightList = (newFlightList:FlightDataInterface[]) => {
    flightsList = newFlightList;
}

export const saveAllFlights = async () => {
  
    try {
        const data = await getAllFlights();
        data.isActive = false;
        setFlightList(data)
      } catch (error) {
        console.error(error)
      }
}

export const removeObjectWithId = (arr:any[], id:any) => {
  const objWithIdIndex = arr.findIndex((obj) => obj._id === id);

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }

  return arr;
}

await saveAllFlights();

