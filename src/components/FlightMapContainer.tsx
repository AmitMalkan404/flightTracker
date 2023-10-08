import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { flightsList } from '../flightsUtils';
import { FlightDataInterface, flightSegmentInterface } from '../interfaces/flightDataInterface';
import { LatLng } from 'leaflet';
import { useEffect } from 'react';


const FlightMapContainer:React.FC = () => {
  
  useEffect(() => {
    // Create a WebSocket connection to the server
    const ws = new WebSocket('ws://localhost:5555/');

    ws.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
    };

    // Set up an event listener to handle incoming messages
    ws.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      // Handle the incoming message from the server
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  })
  return (
      <MapContainer
        center={[32.505, 35.09]} // Initial map center coordinates
        zoom={3} // Initial zoom level
        style={{ height: '500px', width: '100%' }}
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {flightsList.map((flight:FlightDataInterface) => {
          let polylineRouteArray = [new LatLng(flight.initial_location.latitude, flight.initial_location.longitude)]
          flight.segments.forEach((segment:flightSegmentInterface)=> {
              polylineRouteArray.push(new LatLng(segment.latitude,segment.longitude));
          })
          return <Polyline positions={polylineRouteArray} color='red'/>
      })}
      </MapContainer>
  );
}

export default FlightMapContainer;