export interface FlightDataInterface {
    _id:string;
    passengers: number;
    company_name: string;
    destination_country?: string;
    flight_code: string;
    isActive?:boolean;
    initial_location: {
      longitude: number;
      latitude: number;
      date_time: string;
    };
    origin_country?: string;
    segments: flightSegmentInterface[];
}
  
export interface flightSegmentInterface {
  longitude: number;
  latitude: number;
  timespan_seconds: number;
}

export interface flightLocationInterface {
  flightId: string;
  currentPosition: number[];
  current2DGradient: number;
}