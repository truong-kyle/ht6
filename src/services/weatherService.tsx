import { fetchWeatherApi } from 'openmeteo';

export interface HourlyWeatherData {
	time: Date;
	temperature2m: number;
	precipitationProbability: number;
	precipitation: number;
	rain: number;
	showers: number;
	snowfall: number;
}

export async function getNextHourWeather(): Promise<HourlyWeatherData> {
	const params = {
		"latitude": 43.773130,  // Location for Chemistry Building at York University
		"longitude": -79.373300,
		"hourly": ["temperature_2m", "precipitation_probability", "precipitation", "rain", "showers", "snowfall"],
		"timezone": "auto",
		"forecast_days": 1
	};

	const url = "https://api.open-meteo.com/v1/forecast"; 
	
	try {
		const responses = await fetchWeatherApi(url, params);
		
		// Process first location
		const response = responses[0];
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const hourly = response.hourly()!;

		// Get current time and find the next hour index
		const currentTime = new Date();
		const currentHour = currentTime.getHours();
		const nextHourIndex = currentHour + 1; // Next hour index (0-23)

		// Note: The order of weather variables in the URL query and the indices below need to match!
		const weatherData: HourlyWeatherData = {
			time: new Date((Number(hourly.time()) + utcOffsetSeconds + (nextHourIndex * 3600)) * 1000),
			temperature2m: hourly.variables(0)!.valuesArray()![nextHourIndex] || 0,
			precipitationProbability: hourly.variables(1)!.valuesArray()![nextHourIndex] || 0,
			precipitation: hourly.variables(2)!.valuesArray()![nextHourIndex] || 0,
			rain: hourly.variables(3)!.valuesArray()![nextHourIndex] || 0,
			showers: hourly.variables(4)!.valuesArray()![nextHourIndex] || 0,
			snowfall: hourly.variables(5)!.valuesArray()![nextHourIndex] || 0,
		};

		return weatherData;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw new Error('Failed to fetch weather data for next hour');
	}
}



// Test function to see the output
export async function testWeatherOutput() {
	try {
		console.log('🌤️ Testing weather API...');
		const weatherData = await getNextHourWeather();
		console.log('Weather data for next hour:', weatherData);
		console.log('Temperature:', weatherData.temperature2m + '°C');
		console.log('Rain probability:', weatherData.precipitationProbability + '%');
		console.log('Precipitation:', weatherData.precipitation + 'mm');
		console.log('Rain:', weatherData.rain + 'mm');
		console.log('Showers:', weatherData.showers + 'mm');
		console.log('Snowfall:', weatherData.snowfall + 'mm');
		return weatherData;
	} catch (error) {
		console.error('❌ Error testing weather:', error);
	}
}