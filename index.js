import { WeatherCard } from "./weather-card/weather-card.js";

const apiBtn = document.querySelector('#submitAPI_KEY');

function validateApiKey() {
    window.API_KEY = document.querySelector('#API_KEY').value;
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_KEY}`)
        .then((response) => {
            if (response.ok)
                return true;
        })
        .catch(() => { return false })
}

apiBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (await validateApiKey()) {
        document.querySelector('form').style.display = 'none';
        document.querySelector('weather-card').style.display = 'block';
        customElements.define('weather-card', WeatherCard);
        //customElements.define('weather-card', WeatherCard, {API_KEY : API_KEY});
    }
    else
        document.querySelector('.err').innerText = 'Invalid API key';
});

