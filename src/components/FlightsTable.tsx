import React, { useEffect, useState } from 'react';
import { flightsList, saveAllFlights } from '../flightsUtils';
import { FlightDataInterface } from '../interfaces/flightDataInterface';

function FlightTable({ }) {
  const [flights, setFlights] = useState([]);


  useEffect(() => {
    async function fetchFlights() {
        try {
          await saveAllFlights();
        } catch (error) {
          console.error(error)
        }
      }
  
      fetchFlights();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Flight Code</th>
          <th>Passengers</th>
          <th>Flight Date</th>
          <th>Flight Time</th>
        </tr>
      </thead>
      <tbody>
        {flightsList.map((flight:FlightDataInterface) => (
          <tr key={flight._id}>
            <td>{flight.company_name}</td>
            <td>{flight.flight_code}</td>
            <td>{flight.passengers}</td>
            <td>{new Date(flight.initial_location.date_time).toLocaleDateString()}</td>
            <td>{new Date(flight.initial_location.date_time).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FlightTable;
