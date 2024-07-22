const weatherStatusIcons = {
    'clear sky': '/assets/weather_icons/sun.png',
    'few clouds': '/assets/weather_icons/cloudy.png',
    'scattered clouds': '/assets/weather_icons/cloud.png',
    'broken clouds': '/assets/weather_icons/clouds.png',
    'shower rain': '/assets/weather_icons/raining.png',
    'rain': '/assets/weather_icons/rainy-day.png',
    'thunderstorm': '/assets/weather_icons/thunderstorm.png',
    'snow': '/assets/weather_icons/snowy.png',
    'mist': '/assets/weather_icons/fog.png',
    'light rain': '/assets/weather_icons/rainy-day.png'
}

export const getWeatherIconPath = (status) => {
    if (weatherStatusIcons.hasOwnProperty(status)) {
        return weatherStatusIcons[status];
    } else return null;
}