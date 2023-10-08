export interface FlightDataInterface {
    _id:string;
    passengers: number;
    company_name: string;
    flight_code: string;
    initial_location: {
      longitude: number;
      latitude: number;
      date_time: string;
    };
    segments: flightSegmentInterface[];
  }
  
  export interface flightSegmentInterface {
    longitude: number;
      latitude: number;
      timespan_seconds: number;
  }