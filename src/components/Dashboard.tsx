import './dashboard.scss'
import FileUpload from './FileUpload';
import FlightMapContainer from './FlightMapContainer';
import FlightTable from './FlightsTable';

const Dashboard = () =>{

    return (
        <div className="container">
            <div className='map-and-flight-data-container'>
                <div className="map-container"><FlightMapContainer/></div>
                <div className="flight-data-container">data</div>
            </div>
            <div className='input-and-list-container'>
                <div className="flight-data-input-container">
                    <FileUpload />
                </div>
                <div className="flights-list-container">
                    <FlightTable />
                </div>
            </div>
        </div>
    )
}
export default Dashboard