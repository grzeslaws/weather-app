export interface WeatherDetails {
  description: string;
  main: string;
}

export interface Location {
  id: string;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather: WeatherDetails[];
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
}
