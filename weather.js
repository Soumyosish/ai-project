const API_KEY = '836801297450f0eebbc2e2e04c6566c1';

async function fetchWeather(city) {
    try {
        document.querySelector('.loading').style.display = 'block';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.querySelector('.weather-info').innerHTML = `
            <p style="color: red">${error.message}</p>
        `;
    } finally {
        document.querySelector('.loading').style.display = 'none';
    }
}

function displayWeather(data) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit'
    });
    
    const weatherHTML = `
        <div class="location-info">
            <h2 class="location-title">Your Location</h2>
            <div class="coordinates">Coordinates: ${data.coord.lat}, ${data.coord.lon}</div>
            <div class="last-updated">Last updated: ${timeString}</div>
        </div>
        <div class="current-weather">
            <img class="weather-icon" 
                 src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" 
                 alt="${data.weather[0].description}">
            <div class="weather-details">
                <h2>Current Weather</h2>
                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                <div class="weather-description">${data.weather[0].description}</div>
                <div class="location-name">${data.name}</div>
            </div>
        </div>
    `;
    document.querySelector('.weather-info').innerHTML = weatherHTML;
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        document.querySelector('.loading').style.display = 'block';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Location not found');
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.querySelector('.weather-info').innerHTML = `
            <p style="color: red">${error.message}</p>
        `;
    } finally {
        document.querySelector('.loading').style.display = 'none';
    }
}

function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherByCoords(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        (error) => {
            document.querySelector('.weather-info').innerHTML = `
                <p style="color: red">Error: ${error.message}</p>
            `;
        }
    );
}

// Initialize weather widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const locationButton = document.querySelector('.weather-button.location');
    if (locationButton) {
        locationButton.addEventListener('click', getLocation);
        // Get weather for current location on load
        getLocation();
    }
});