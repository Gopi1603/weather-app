document.addEventListener('DOMContentLoaded', () => {
    const fetchWeatherButton = document.getElementById('fetchWeather');
    const placeNameInput = document.getElementById('placeName');
    const weatherContainer = document.getElementById('weather');
    const body = document.body;

    fetchWeatherButton.addEventListener('click', () => {
        const placeName = placeNameInput.value;
        fetchCoordinates(placeName);
    });

    async function fetchCoordinates(placeName) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${placeName}&format=json&limit=1`);
            if (!response.ok) {
                throw new Error('Place not found');
            }
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeather(lat, lon);
            } else {
                throw new Error('Place not found');
            }
        } catch (error) {
            weatherContainer.innerHTML = '<p>📍 Location not found. Please try again.</p>';
        }
    }

    async function fetchWeather(latitude, longitude) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            const weatherData = await response.json();
            displayWeather(weatherData.current_weather);
            adjustBackground(weatherData.current_weather.temperature);
        } catch (error) {
            weatherContainer.innerHTML = '<p>🌧️ Unable to fetch weather. Please try again.</p>';
        }
    }

    function displayWeather(data) {
        const { temperature, windspeed, humidity } = data;

        let weatherHTML = `
            <h2>Current Weather</h2>
            <p>🌡️ Temperature: ${temperature !== undefined ? temperature + '°C' : 'N/A'}</p>
            <p>💨 Wind Speed: ${windspeed !== undefined ? windspeed + ' m/s' : 'N/A'}</p>
        `;

        if (humidity !== undefined) {
            weatherHTML += `<p>💧 Humidity: ${humidity}%</p>`;
        }

        weatherContainer.innerHTML = weatherHTML;
    }

    function adjustBackground(temperature) {
        let gradient;
        if (temperature <= 0) {
            gradient = 'linear-gradient(to right, #00c6ff, #0072ff)'; // cold: blue gradient
        } else if (temperature > 0 && temperature <= 15) {
            gradient = 'linear-gradient(to right, #a1c4fd, #c2e9fb)'; // cool: light blue gradient
        } else if (temperature > 15 && temperature <= 25) {
            gradient = 'linear-gradient(to right, #fceabb, #f8b500)'; // warm: yellow gradient
        } else if (temperature > 25) {
            gradient = 'linear-gradient(to right, #ff0844, #ffb199)'; // hot: red gradient
        } else {
            gradient = 'linear-gradient(to right, #6a11cb, #2575fc)'; // default gradient
        }
        body.style.background = gradient;
    }
});
