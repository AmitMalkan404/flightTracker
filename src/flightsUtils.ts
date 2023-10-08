import { getAllFlights } from './services/ApiService';
import {FlightDataInterface} from './interfaces/flightDataInterface'

export let flightsList:FlightDataInterface[] = []

export const setFlightList = (newFlightList:FlightDataInterface[]) => {
    flightsList = newFlightList;
}

export const saveAllFlights = async () => {
    try {
        const data = await getAllFlights();
        setFlightList(data)
      } catch (error) {
        console.error(error)
      }
}
await saveAllFlights();