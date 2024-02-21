
import React, { useEffect, useRef, useState } from 'react';
import { eventBus } from '../hooks/services';
import { FlightDataInterface, flightSegmentInterface } from '../interfaces/flightDataInterface';
import { flightsList } from '../flightsUtils';
import { getLocationDetailsByLonLat } from '../services/ApiService';

export interface FlightDataPreserverProps {}


const FlightDataPreserver: React.FC<FlightDataPreserverProps> = (props:FlightDataPreserverProps) => {
    const [selectedFlightData, setSelectedFlightData] = useState<FlightDataInterface>();
    
    useEffect(() => {
        eventBus.subscribe("flightDataPreserver","public.map.selectedFlight",onSelectedFlightChanged)

        return (): void => {
            eventBus.unsubscribe("flightDataPreserver","public.map.selectedFlight");
        }
    },[])

    const onSelectedFlightChanged = (selectedFlightId:string):void =>{
        flightsList.forEach((flightData) => {
            if (flightData._id===selectedFlightId){
                setSelectedFlightData(flightData);
                return;
            }
        });
    }

    const calculateLandingTime = (flightData:FlightDataInterface) => {
        const takeoffTime = new Date(flightData.initial_location.date_time);
        let flightDuration:number = 0;
        flightData.segments.forEach((segment:flightSegmentInterface) => {
            flightDuration += segment.timespan_seconds
        })
        const landingTime = takeoffTime.setSeconds(takeoffTime.getSeconds() + flightDuration);
        return new Date(landingTime);
    }

    return(<table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Flight Code</th>
            <th>Passengers</th>
            <th>Destination Country</th>
            <th>Flight Date</th>
            <th>Flight Time</th>
            <th>Expected Landing Date</th>
            <th>Expected Landing Time</th>

          </tr>
        </thead>
        {selectedFlightData &&
        (<tbody>
            <tr key={selectedFlightData._id}>
                <td>{selectedFlightData.company_name}</td>
                <td>{selectedFlightData.flight_code}</td>
                <td>{selectedFlightData.passengers}</td>
                <td>{selectedFlightData.destination_country}</td>
                <td>{new Date(selectedFlightData.initial_location.date_time).toLocaleDateString()}</td>
                <td>{new Date(selectedFlightData.initial_location.date_time).toLocaleTimeString()}</td>
                <td>{calculateLandingTime(selectedFlightData).toLocaleDateString()}</td>
                <td>{calculateLandingTime(selectedFlightData).toLocaleTimeString()}</td>

            </tr>
        </tbody>)}
      </table>)
}
export default FlightDataPreserver