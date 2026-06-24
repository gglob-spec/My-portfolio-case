// ==========================================================================
// 1. Background Image Slideshow Controller
// ==========================================================================
const backgroundImages = [
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop'
];

let currentImageIndex = 0;

function startBackgroundSlideshow() {
    const bgOverlay = document.querySelector('.bg-overlay');
    if (!bgOverlay) return;

    bgOverlay.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${backgroundImages[currentImageIndex]}')`;

    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        bgOverlay.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${backgroundImages[currentImageIndex]}')`;
    }, 7000);
}

// ==========================================================================
// 2. DOM Initialization & Robust Event Binding
// ==========================================================================
let cityInput, loadBtn, weatherDisplay, errorMsg;
let weeklyForecastData = null; 

document.addEventListener('DOMContentLoaded', () => {
    startBackgroundSlideshow();

    cityInput = document.getElementById('cityInput');
    loadBtn = document.getElementById('loadBtn');
    weatherDisplay = document.getElementById('weatherDisplay');
    errorMsg = document.getElementById('errorMsg');

    if (loadBtn) {
        loadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetchWeather();
        });
    }

    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchWeather();
            }
        });
    }
});

// ==========================================================================
// 3. Main Weather Fetching Controller (Updated for Daily Max Humidity)
// ==========================================================================
async function fetchWeather() {
    if (!cityInput || !weatherDisplay) return;
    
    const cityValue = cityInput.value.trim();

    if (!cityValue) {
        showError('Please enter a city name to search.');
        return;
    }

    clearError();
    weatherDisplay.innerHTML = '<div class="spinner"></div>';
    if (loadBtn) loadBtn.disabled = true;
    weeklyForecastData = null; 

    try {
        // Step 1: Geocoding API - Fetch Coordinates
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityValue)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geocodeUrl);
        
        if (!geoResponse.ok) throw new Error('Location service error. Please try again.');
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please check spelling.');
        }

        const result = geoData.results[0];
        const cityName = result.name;
        const countryName = result.country || '';
        const regionName = result.admin1 || '';
        
        const locationString = regionName ? `${cityName}, ${regionName}` : `${cityName}, ${countryName}`;

        // Step 2: Weather API - Added relative_humidity_2m_max to daily options matrix
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,relative_humidity_2m_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error('Weather server connection error.');

        const weatherData = await weatherResponse.json();
        
        if (!weatherData.current || !weatherData.daily) {
            throw new Error('Could not read forecast metrics data.');
        }

        weeklyForecastData = weatherData.daily;
        renderWeatherCard(weatherData.current, locationString);

    } catch (error) {
        showError(error.message);
        resetWelcomeState();
    } finally {
        if (loadBtn) loadBtn.disabled = false;
    }
}

// ==========================================================================
// 4. Dynamic HTML Renderer (Current Layout Card)
// ==========================================================================
function renderWeatherCard(current, locationString) {
    const temperature = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    const rainChance = current.precipitation_probability !== undefined ? current.precipitation_probability : 0; 
    
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
                    Rain Chance
                    <strong><i class="fa-solid fa-cloud-umbrella" style="color: #3498db; font-size: 0.95rem; margin-right: 2px;"></i> ${rainChance}%</strong>
                </div>
                <div class="detail-item">
                    Humidity
                    <strong>${humidity}%</strong>
                </div>
                <div class="detail-item">
                    Wind Speed
                    <strong>${windSpeed} km/h</strong>
                </div>
            </div>

            <button id="toggleWeeklyBtn" class="weekly-toggle-btn" onclick="toggleWeeklyForecast()">
                <i class="fa-solid fa-calendar-days"></i> View Weekly Forecast
            </button>

            <div id="weeklyForecastContainer" class="weekly-forecast-container hidden"></div>
        </div>
    `;
}

// ==========================================================================
// 4b. Dynamic Weekly Accordion Drawer Builder (Updated with Humidity Columns)
// ==========================================================================
function toggleWeeklyForecast() {
    const container = document.getElementById('weeklyForecastContainer');
    const toggleBtn = document.getElementById('toggleWeeklyBtn');
    
    if (!container || !weeklyForecastData) return;

    if (container.classList.contains('hidden')) {
        let htmlContent = '<div class="weekly-list-wrapper">';

        // Added Humidity Header Label
        htmlContent += `
            <div class="weekly-headers-banner">
                <span class="hdr-day">Day</span>
                <span class="hdr-cond">Cond.</span>
                <div class="hdr-metrics-group">
                    <span class="hdr-lbl"><i class="fa-solid fa-temperature-high"></i> Max Temp</span>
                    <span class="hdr-lbl"><i class="fa-solid fa-droplet"></i> Max Hum.</span>
                    <span class="hdr-lbl"><i class="fa-solid fa-cloud-umbrella"></i> Rain Chance</span>
                    <span class="hdr-lbl"><i class="fa-solid fa-wind"></i> Wind Speed</span>
                </div>
            </div>
        `;

        for (let i = 0; i < weeklyForecastData.time.length; i++) {
            const rawDate = new Date(weeklyForecastData.time[i]);
            
            const dayName = i === 0 ? "Today" : rawDate.toLocaleDateString('en-US', { weekday: 'short' });
            const numericDate = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const dayTemp = Math.round(weeklyForecastData.temperature_2m_max[i]);
            const dayHum = weeklyForecastData.relative_humidity_2m_max ? Math.round(weeklyForecastData.relative_humidity_2m_max[i]) : '--';
            const dayRain = weeklyForecastData.precipitation_probability_max[i] || 0;
            const dayWind = weeklyForecastData.wind_speed_10m_max[i];
            const dayWeather = interpretWeatherCode(weeklyForecastData.weather_code[i]);

            // Embedded a new "hum-p" capsule block matching alignment
            htmlContent += `
                <div class="weekly-row">
                    <div class="weekly-date-box">
                        <span class="weekly-day-title">${dayName}</span>
                        <span class="weekly-calendar-sub">${numericDate}</span>
                    </div>
                    <div class="weekly-icon-col">
                        <i class="fa-solid ${dayWeather.icon}" title="${dayWeather.description}"></i>
                    </div>
                    <div class="weekly-metrics-col">
                        <span class="weekly-metric-capsule max-t">${dayTemp}°C</span>
                        <span class="weekly-metric-capsule hum-p">${dayHum}%</span>
                        <span class="weekly-metric-capsule rain-p">${dayRain}%</span>
                        <span class="weekly-metric-capsule wind-m">${dayWind} km/h</span>
                    </div>
                </div>
            `;
        }

        htmlContent += '</div>';
        container.innerHTML = htmlContent;
        container.classList.remove('hidden');
        toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Weekly Forecast';
    } else {
        container.classList.add('hidden');
        container.innerHTML = '';
        toggleBtn.innerHTML = '<i class="fa-solid fa-calendar-days"></i> View Weekly Forecast';
    }
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
    if (!errorMsg) return;
    const textSpan = errorMsg.querySelector('.error-text');
    if (textSpan) {
        textSpan.textContent = message;
    }
    errorMsg.style.display = 'flex';
}

function clearError() {
    if (errorMsg) errorMsg.style.display = 'none';
}

function resetWelcomeState() {
    if (!weatherDisplay) return;
    weatherDisplay.innerHTML = `
        <div class="welcome-slate">
            <i class="fa-solid fa-location-crosshairs placeholder-icon"></i>
            <p>Enter a city above to plan your day with confidence.</p>
        </div>
    `;
}