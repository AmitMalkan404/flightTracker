import { useState } from 'react';
import './dashboard.scss'
import FileUpload from './FileUpload';
import FlightMapContainer from './FlightMapContainer';
import FlightTable from './FlightsTable';
import FlightDataPreserver from './FlightDataPreserver';

const Dashboard = () =>{

    const [latestFlightAdded, setLatestFlightAdded] = useState<string>('')

    const handleNewFlightAdded = (flightId: string) => {
        setLatestFlightAdded(flightId);
    }

    return (
        <div className="container">
            <div className='map-and-flight-data-container'>
                <div className="map-container"><FlightMapContainer/></div>
                <div className="flight-data-container"><FlightDataPreserver/></div>
            </div>
            <div className='input-and-list-container'>
                <div className="flight-data-input-container">
                    <FileUpload />
                </div>
                <div className="flights-list-container">
                    <FlightTable/>
                </div>
            </div>
        </div>
    )
}
export default Dashboard