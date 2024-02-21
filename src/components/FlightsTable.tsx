import React, { useEffect, useReducer, useState } from 'react';
import { flightsList, removeObjectWithId, saveAllFlights, setFlightList } from '../flightsUtils';
import { FlightDataInterface } from '../interfaces/flightDataInterface';
import { deleteFlight } from '../services/ApiService';
import { eventBus } from '../hooks/services';

export interface FlightTableProps {}


const FlightTable: React.FC<FlightTableProps> = (props:FlightTableProps) => {

  
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  function handleDeleteBtnClick(flightId:string) {
    deleteFlight(flightId).then(() => {
      const newFlightArray = removeObjectWithId(flightsList,flightId)
      setFlightList([...newFlightArray]);
      forceUpdate();
    });
  }

  

  const buildTable = () => {
    return (
    flightsList.map((flight:FlightDataInterface) => (
      <tr key={flight._id}>
        <td>{flight.company_name}</td>
        <td>{flight.flight_code}</td>
        <td>{flight.isActive?"✔️":""}</td>
        <td>{new Date(flight.initial_location.date_time).toLocaleDateString()}</td>
        <td>{new Date(flight.initial_location.date_time).toLocaleTimeString()}</td>
        <td>
          <button onClick={ () =>{
            handleDeleteBtnClick(flight._id)
            }
          }
          >🗑</button>
        </td>
      </tr>
    )))
  }
  
  useEffect(() => {
    eventBus.subscribe("FlightTable","public.table.newFlightAdded",() => {forceUpdate()});
    eventBus.subscribe("FlightTable","public.table.FlightHasBeenActivated",() => {forceUpdate()});
    return () => {
      eventBus.unsubscribe("FlightTable","public.table.newFlightAdded");
      eventBus.unsubscribe("FlightTable","public.table.FlightHasBeenActivated");
    };
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Flight Code</th>
          <th>Active</th>
          <th>Flight Date</th>
          <th>Flight Time</th>
        </tr>
      </thead>
      <tbody>
        {buildTable()}
      </tbody>
    </table>
  );
}

export default FlightTable;
