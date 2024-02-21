import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { flightsList } from '../flightsUtils';
import { FlightDataInterface, flightSegmentInterface, flightLocationInterface } from '../interfaces/flightDataInterface';
import L, { Icon, LatLng } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import airplaneIconUrl from './../assets/airplane-mode-svgrepo-com.svg';
import 'leaflet-rotatedmarker';


//@ts-ignore
import io  from "socket.io-client";
import { eventBus } from '../hooks/services';


const FlightMapContainer:React.FC = () => {

  const [currentFlightsLocationsArray, setCurrentFlightsLocationsArray] = useState<Array<any>>([]);
  const selectedFlightIdRef = useRef<string>('')
  
  const airplaneIcon = L.icon({
    iconUrl: airplaneIconUrl,
    iconSize: [30, 30], // Adjust the size of the icon
    iconAnchor: [0, 20], // Adjust the anchor point of the icon (centered)
    
  });

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080")

    socket.addEventListener("open", (event) => {
      socket.send("Connection established")
    })

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", JSON.parse(event.data))
      const dataReceived = JSON.parse(event.data);
      setActiveFlights(dataReceived.data)
      if (dataReceived.data.length !== currentFlightsLocationsArray.length) eventBus.publish("public.table.FlightHasBeenActivated",null);
      setCurrentFlightsLocationsArray(dataReceived.data);
    })

    return () => {
      socket.close();
    }

  }, [])

  const setActiveFlights = (activeFlightsArray:flightLocationInterface[]) => {
    flightsList.forEach((flightPlan) => {
      flightPlan.isActive = activeFlightsArray.some((flight) => flight.flightId===flightPlan._id)
    })
  }

  const handleSelectedFlight = (location:any) => {
    selectedFlightIdRef.current = location.flightId;
    eventBus.publish("public.map.selectedFlight",location.flightId);
  }

  useEffect(() => {
    const check = flightsList.some((flight) => flight._id === selectedFlightIdRef.current)
    if (!check) selectedFlightIdRef.current = '';
  },[flightsList])

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
          const isFlightRouteIsWithMarker = currentFlightsLocationsArray.some((flight2) => flight2.flightId===flight._id)
          if(flight._id===selectedFlightIdRef.current&&isFlightRouteIsWithMarker)  return <Polyline positions={polylineRouteArray} color={'red'}/>
      })}
      {currentFlightsLocationsArray.map((location, index) => (
        <Marker key={index}
        position={[location.currentPosition[1], location.currentPosition[0]]}
        icon={airplaneIcon}
        rotationAngle={location.current2DGradient}
        eventHandlers={{
          click: () => {handleSelectedFlight(location)}
        }}>
        </Marker>
    ))}
      </MapContainer>
  );
}

export default FlightMapContainer;