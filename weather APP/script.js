// ==========================================================================
// 1. Background Image Slideshow Controller
// ==========================================================================
const backgroundImages = [
    // 1. Existing Storm Image
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop',
    // 2. Vibrant Sunny Landscape
    'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=2000&auto=format&fit=crop',
    // 3. Atmospheric Rain Landscape
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop'
];

let currentImageIndex = 0;

function startBackgroundSlideshow() {
    const bgOverlay = document.querySelector('.bg-overlay');
    if (!bgOverlay) return;

    // Set the initial image immediately
    bgOverlay.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${backgroundImages[currentImageIndex]}')`;

    // Rotate images automatically every 7 seconds
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        bgOverlay.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${backgroundImages[currentImageIndex]}')`;
    }, 7000);
}

// Initialize the slideshow as soon as the DOM loads
document.addEventListener('DOMContentLoaded', startBackgroundSlideshow);


// ==========================================================================
// 2. DOM Element Selectors & Event Listeners
// ==========================================================================
const cityInput = document.getElementById('cityInput');
const loadBtn = document.getElementById('loadBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMsg = document.getElementById('errorMsg');

loadBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});


// ==========================================================================
// 3. Main Weather Fetching Controller
// ==========================================================================
async function fetchWeather() {
    const cityValue = cityInput.value.trim();

    // Field Validation
    if (!cityValue) {
        showError('Please enter a city name to search.');
        return;
    }

    // Set UI Loading State
    clearError();
    weatherDisplay.innerHTML = '<div class="spinner"></div>';
    loadBtn.disabled = true;

    try {
        // Step 1: Geocoding API - Convert City Name to Lat/Lon Coordinates
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityValue)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geocodeUrl);
        
        if (!geoResponse.ok) throw new Error('Location service error. Please try again.');
        
        const geoData = await geoResponse.json();
        
        // Handle city not found error
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please check spelling.');
        }

        // Extract location details safely
        const result = geoData.results[0];
        const cityName = result.name;
        const countryName = result.country || '';
        const regionName = result.admin1 || '';
        
        const locationString = regionName ? `${cityName}, ${regionName}` : `${cityName}, ${countryName}`;

        // Step 2: Weather API - Fetch current conditions using retrieved coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error('Weather server connection error.');

        const weatherData = await weatherResponse.json();
        
        if (!weatherData.current) {
            throw new Error('Could not read current weather data.');
        }

        // Render data to the screen
        renderWeatherCard(weatherData.current, locationString);

    } catch (error) {
        showError(error.message);
        resetWelcomeState();
    } finally {
        loadBtn.disabled = false;
    }
}


// ==========================================================================
// 4. Dynamic HTML Renderer
// ==========================================================================
function renderWeatherCard(current, locationString) {
    const temperature = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    
    const weatherInfo = interpretWeatherCode(current.weather_code);

    weatherDisplay.innerHTML = `
        <div class="current-weather">
            <h2 class="location">${locationString}</h2>
            <div class="temp-display">
                <span class="temperature">${temperature}°C</span>
                <i class="fa-solid ${weatherInfo.icon} weather-status-icon"></i>
            </div>
            <p class="condition">${weatherInfo.description}</p>
            
            <div class="details-grid">
                <div class="detail-item">
                    Humidity
                    <strong>${humidity}%</strong>
                </div>
                <div class="detail-item">
                    Wind Speed
                    <strong>${windSpeed} km/h</strong>
                </div>
            </div>
        </div>
    `;
}


// ==========================================================================
// 5. Translates WMO Weather Codes to Descriptions and Icons
// ==========================================================================
function interpretWeatherCode(code) {
    if (code === 0) return { description: 'Clear sky', icon: 'fa-sun' };
    if (code >= 1 && code <= 3) return { description: 'Partly cloudy', icon: 'fa-cloud-sun' };
    if (code === 45 || code === 48) return { description: 'Foggy', icon: 'fa-smog' };
    if (code >= 51 && code <= 55) return { description: 'Drizzle', icon: 'fa-cloud-sun-rain' };
    if (code >= 61 && code <= 65) return { description: 'Rain showers', icon: 'fa-cloud-showers-heavy' };
    if (code >= 71 && code <= 77) return { description: 'Snowfall', icon: 'fa-snowflake' };
    if (code >= 80 && code <= 82) return { description: 'Heavy rain', icon: 'fa-cloud-showers-water' };
    if (code >= 95 && code <= 99) return { description: 'Thunderstorm', icon: 'fa-cloud-bolt' };
    return { description: 'Cloudy', icon: 'fa-cloud' };
}


// ==========================================================================
// 6. UI Notification State Handlers
// ==========================================================================
function showError(message) {
    const textSpan = errorMsg.querySelector('.error-text');
    if (textSpan) {
        textSpan.textContent = message;
    }
    errorMsg.style.display = 'flex';
}

function clearError() {
    errorMsg.style.display = 'none';
}

function resetWelcomeState() {
    weatherDisplay.innerHTML = `
        <div class="welcome-slate">
            <i class="fa-solid fa-location-crosshairs placeholder-icon"></i>
            <p>Enter a city above to plan your day with confidence.</p>
        </div>
    `;
}