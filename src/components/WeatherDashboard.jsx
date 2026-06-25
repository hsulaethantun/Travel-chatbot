import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Thailand cities with coordinates
const cities = {
    Bangkok: { lat: 13.7563, lon: 100.5018 },
    ChiangMai: { lat: 18.7883, lon: 98.9853 },
    ChiangRai: { lat: 19.9139, lon: 99.8305 },
    Pattaya: { lat: 12.9236, lon: 100.8825 },
    Phuket: { lat: 7.8804, lon: 98.3923 },
    Ayutthaya: { lat: 14.3566, lon: 100.5978 },
    Krabi: { lat: 8.3252, lon: 98.7755 },
    KohSamui: { lat: 8.3252, lon: 98.7755 },
    Kanchanaburi: { lat: 8.3252, lon: 98.7755 },
    HuaHin: { lat: 8.3252, lon: 98.7755 }
};

import { useLanguage } from "../context/LanguageContext";

export default function WeatherDashboard() {
    const { t } = useLanguage();
    const [selectedCity, setSelectedCity] = useState("Bangkok");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        fetchWeather();
    }, [selectedCity]);

    const fetchWeather = async () => {
        const { lat, lon } = cities[selectedCity];

        // Updated URL to fetch current weather and 14-day forecast
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=14&timezone=Asia/Bangkok`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            setCurrentWeather(data.current);
            setWeatherData(data.daily);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    const chartData = {
        labels: weatherData?.time || [],
        datasets: [
            {
                label: `${t('temp')} Max (°C)`,
                data: weatherData?.temperature_2m_max || [],
                borderColor: "#f97316",
                backgroundColor: "rgba(249, 115, 22, 0.5)",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#f97316",
            },
            {
                label: `${t('temp')} Min (°C)`,
                data: weatherData?.temperature_2m_min || [],
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14, 165, 233, 0.5)",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#0ea5e9",
            },
            {
                label: t('rain'),
                data: weatherData?.precipitation_sum || [],
                borderColor: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.5)",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#22c55e",
            }
        ]
    };

    return (
        <div style={{ padding: "20px", color: "#2E3D5D" }}>
            <h2 className="text-center fw-bold">{t('weather_dashboard')}</h2>

            {/* City Selector */}
            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                    padding: "3px",
                    marginBottom: "20px",
                    borderRadius: "10px",
                    border: "1px solid #2E3D5D",
                    fontWeight: "bold",
                    backgroundColor: "#2E3D5D",
                    color: "#fff"
                }}
            >
                {Object.keys(cities).map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>

            {/* Current Weather */}
            {currentWeather && (
                <div style={{ marginBottom: "30px" }}>
                    <h3>{t('current_weather')} {selectedCity}</h3>
                    <p>🌡 {t('temp')}: {currentWeather.temperature_2m || currentWeather.temperature}°C</p>
                    <p>💨 {t('wind')}: {currentWeather.wind_speed_10m || currentWeather.windspeed} km/h</p>
                    <p>💧 {t('rain')}: {currentWeather.precipitation === 0 ? t('weather_no_rain') : `${currentWeather.precipitation} mm`}</p>
                    <p>🕒 {t('time')}: {currentWeather.time.replace('T', ' ')}</p>
                </div>
            )}

            {/* Past & Future Forecast Chart */}
            {weatherData && (
                <div style={{ width: "100%", overflowX: 'auto', marginTop: '20px' }}>
                    <h3 className="h5">{t('weather_forecast')}</h3>
                    <div style={{ minWidth: '300px', width: '100%' }}>
                        <Line data={chartData} options={{ maintainAspectRatio: true, responsive: true }} />
                    </div>
                </div>
            )}
        </div>
    );
}