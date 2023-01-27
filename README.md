# Weather-Card



WeatherCard is a JavaScript library that allows you to easily display weather information on your website or application. It uses the [OpenWeatherMap API](https://openweathermap.org/api) to retrieve weather data and provides a customizable weather card element that can be easily integrated into your project.

View live demo [here.](https://3l4x.github.io/weather-card-app/)

![ A screenshot of the weather card displaying weather information for a location](https://i.imgur.com/xVJ0eUC.png)
## Note
The entire project was made with very specific things in mind (practising destructuring assignment, spread operator, customelements, async javascript etc.) as it was an assignment. I was not allowed to use any packages like dotenv which would have been perfect for API_KEY.



## Current features of Weather-Card
- Using **navigator.geolocation API** to get the user's current location and using that location to fetch data from **OpenWeatherMap API**
- Displaying the **current temperature**, **weather conditions**, and an **icon** based on weather conditions.
- Allowing the user to **search & display weather info** for other locations (search results are limited to 5 since I can only use free API)
- Using fetch API to display a **5 day forecast** for the given location.
- The option to show or hide the 5 day forecast.




## Getting started

To include the weatherCard library in your project, follow these steps:


1. Add the weather-card folder's content (weather-card.js and weather-card.css) to your project directory.

2. Include the WeatherCard class in your javascript file like this:
	```javascript
	import { WeatherCard } from  "./weather-card/weather-card.js";
	```
3. You'll need an API key from OpenWeatherMap. Once you have the API key, you'll need to set the window.API_KEY property to the API_KEY. You can also use an alternative method.

4. Register the custom element by using the following code:
	```javascript
	customElements.define('weather-card', WeatherCard);
	```
5. To display the weather-card element you'll need to add the following html snippet to your code:
    ``` html
    <weather-card>
        <div class="main">
            <div class="location">
                Unknown
            </div>
            <div class="date">
                0
            </div>
            <div class="temp">
                0
            </div>
            <div class="icon">
            </div>
            <div class="conditions">
                Unknown
            </div>
        </div>
        <div class="searchbar">
            Location: <input type="text">
            <button id="submit">Search</button>
            <button id="show">Show</button>
            <div class="results"></div>
        </div>

        <label for="toggle"> 5 day forecast</label>
        <button id="toggle">Toggle</button>
        <div class="forecast">
        </div>
    </weather-card>
    ```

With this setup, the weatherCard library is ready to be used.

## Planned improvements
- Actual **error handling**
- The **custom element's skeleton** is hardcoded inside the element's innerhtml, that is being copied later on to make cards etc. I would like to **dynamically create** all of this with javascript.
- The **css** is very basic, only there so it looks somewhat organised. That will be changed.


## Customization
- You can customize <weather-card> element by editing the weather-card.css file.
- You can modify the way weather-card is structured by modifying the html code snippet I added in the index.html.


## Browser support
- This component uses Web Components API, which is currently supported in all of the modern browsers. It might not work on older ones.
- WeatherCard also requires fetch and Promise to work, make sure these are supported by your browser.
