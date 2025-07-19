import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 43.773130,  //Location for Chemistry Building at York University
	"longitude": -79.373300,
	"current": ["temperature_2m", "precipitation", "rain", "showers", "snowfall"],
	"timezone": "auto",
	"forecast_days": 1
};

const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);
// Process first location. Add a for-loop for multiple locations or weather models

const response = responses[0];


const current = response.current()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		temperature2m: current.variables(0)!.value(),
		precipitation: current.variables(1)!.value(),
		rain: current.variables(2)!.value(),
		showers: current.variables(3)!.value(),
		snowfall: current.variables(4)!.value(),
	},
};

// `weatherData` now contains a simple structure with arrays for datetime and weather data

export function getWeatherData() {
    return weatherData;
}
