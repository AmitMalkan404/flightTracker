import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { flightsList } from '../flightsUtils';
import { FlightDataInterface, flightSegmentInterface } from '../interfaces/flightDataInterface';
import L, { Icon, LatLng } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import airplaneIconUrl from './../assets/airplane-shape-svgrepo-com.svg'; // Update the path

//@ts-ignore
import io  from "socket.io-client";


const FlightMapContainer:React.FC = () => {

  const [currentFlightsLocationsArray, setCurrentFlightsLocationsArray] = useState<Array<any>>([]);
  const selectedFlightIdRef = useRef<string>('')

  const airplaneIcon = L.icon({
    iconUrl: airplaneIconUrl,
    iconSize: [30, 30], // Adjust the size of the icon
    iconAnchor: [0, 0], // Adjust the anchor point of the icon (centered)
  });
  
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080")

    socket.addEventListener("open", (event) => {
      socket.send("Connection established")
    })

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", JSON.parse(event.data))
      const dataReceived = JSON.parse(event.data);
      setCurrentFlightsLocationsArray(dataReceived.data);
    })

    return () => {
      // socket.send("disconnect");
      socket.close();
    }

  }, [])

  useEffect(() => {
    const check = flightsList.some((flight) => flight._id===selectedFlightIdRef.current)
    if (!check) selectedFlightIdRef.current = '';
  },[flightsList])
  
  const createMarkers = (locations:Array<any>) => {
    return locations.map((location, index) => (
      <Marker key={index}
      position={[location.currentPosition[1], location.currentPosition[0]]}
      icon={airplaneIcon}
      eventHandlers={{
        click: () => {
          selectedFlightIdRef.current = location.flightId;
        }
      }}>
        {/* <Popup>
          <div>Marker {index + 1}</div>
        </Popup> */}
      </Marker>
    ));
  };

  return (
      <MapContainer
        center={[32.505, 35.09]} // Initial map center coordinates
        zoom={3} // Initial zoom level
        style={{ height: '100%', width: '100%' }}
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
          if(flight._id===selectedFlightIdRef.current)  return <Polyline positions={polylineRouteArray} color={'red'}/>
      })}
      {createMarkers(currentFlightsLocationsArray)}
      </MapContainer>
  );
}

export default FlightMapContainer;