export class WeatherCard extends HTMLElement {
    constructor() {
        super();
        this._API_KEY = window.API_KEY;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = this.innerHTML;
        this.innerHTML = '';
        this.loadCSS();

        this.cardTemplate = this.selector('.main').cloneNode(true);

        this.selector('#submit').addEventListener(('click'), (e) => {
            this.displaySearchResults(e);
        });

        this.selector('#show').addEventListener(('click'), (e) => {
            const selection = this.selector('select option:checked');
            if (!selection)
                return;
            this.updateData(JSON.parse(selection.value));
        });

        this.selector('#toggle').addEventListener('click', () => {
            //this.selector('.forecast').hidden = !this.selector('.forecast').hidden;
            this.selector('.forecast').classList.toggle('hidden');
        })
        getCurrentLocation()
            .then((pos) => {
                return [pos.coords.latitude, pos.coords.longitude];
            })
            .then((pos) => { this.updateData(pos) })
            //TODO actual error catching..
            .catch((err) => { console.log(err) });
    }

    async loadCSS() {
        const response = await fetch('./weather-card/weather-card.css');
        const css = await response.text();
        const style = new CSSStyleSheet();
        style.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [style];
    }

    updateData(pos) {
        this.getData(pos)
            .then((response) => { return response.json() })
            .then((data) => {
                this.showData(this.transformData(data));
            })
            //TODO actual error catching..
            .catch((err) => { console.log(err) });
    }


    //!original transformData was too complicated and confusing. Had to make it a bit more elegant.
    /*
    @return obj
    example obj:
    {
        "city": {
        "name": "London",
        "coord": {
            "lat": 51.5085,
            "lon": -0.1257
        },
        "2023-01-23": {
        "temp": 1.64,
        "feels_like": -2.42
        "description": "overcast clouds",
        "icon": "04n"
        "dt_txt": "2023-01-23 00:00:00"
        },
        "2023-01-24": {
        .....
    }
    */
    transformData(data) {
        //data.list.main.temp
        //data.list.main.feels_like
        //data.list.dt
        //data.list.weather[0].description
        //data.list.weather[0].icon

        //data.city.name
        //data.city.coord.lat data.city.coord.lon
        const { city: { name, coord: { lat, lon } } } = data;
        return data.list.map((dailyData) => {
            const {
                main: { temp, feels_like },
                weather: [{ description, icon }],
                dt_txt,
            } = dailyData;
            return {
                temp, feels_like, description, icon, dt_txt
            };

        }).reduce((acc, curr) => {
            const date = curr.dt_txt.split(' ')[0];
            if (!acc.hasOwnProperty(date))
                acc[date] = curr;
            return acc;
        }, {
            city: {
                name: name,
                coord: {
                    lat: lat,
                    lon: lon
                }
            }
        });
    }

    getData(pos) {
        if (!Array.isArray(pos))
            return Promise.reject(new Error('Invalid parameter'));
        let [lat, lon] = pos;
        const params = new URLSearchParams({
            lat,
            lon,
            units: 'metric',
            appid: this._API_KEY
        });
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`);
    }

    showData(data) {


        const createCard = (key, ptr, loc = '') => {
            const newCard = this.cardTemplate.cloneNode(true);
            newCard.classList = 'card';
            const icon = newCard.querySelector('.icon');
            const temp = newCard.querySelector('.temp');
            const conditions = newCard.querySelector('.conditions');
            const date = newCard.querySelector('.date');
            const location = newCard.querySelector('.location');
            if (loc)
                location.innerHTML = loc;
            else
                newCard.removeChild(location);
            date.innerHTML = `${data[key].dt_txt.split(' ')[0]}`
            temp.innerHTML = `${data[key].temp}°C`;

            conditions.innerHTML = `Feels like ${data[key].feels_like}°C. ` +
                `${data[key].description.charAt(0).toUpperCase() + data[key].description.slice(1)}`;
            const img = document.createElement('img');
            //getting icon URL
            //`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`
            img.src = `https://openweathermap.org/img/wn/${data[key].icon}@2x.png`;
            icon.innerHTML = '';
            icon.appendChild(img);
            ptr.append(newCard);
        }

        const main = this.selector('.main');
        main.innerHTML = '';
        const forecast = this.selector('.forecast');
        forecast.innerHTML = '';
        const keys = Object.keys(data);
        let ptr = main;
        let i = 0;
        let location;
        keys.forEach((key) => {
            //TODO this will throw an error sometime in the far future soontm
            if (!data.hasOwnProperty(key))
                return
            if (i !== 0) {
                ptr = this.selector('.forecast');
            }
            if (key === 'city') {
                location = `${data[key].name} (lat: ${data[key].coord.lat}, long: ${data[key].coord.lon})`;
                return;
            }
            createCard(key, ptr, location);
            if (location)
                location = '';
            i += 1;
        })

    }



    //using Openweather api to fetch max 5 locations for search result
    fetchResults(city) {
        if (!city || city.length === 0)
            return Promise.reject(new Error('No city given'));
        //'https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}'
        const params = new URLSearchParams({
            q: city,
            limit: 5,
            appid: this._API_KEY
        })
        return fetch(`https://api.openweathermap.org/geo/1.0/direct?${params}`);
    }

    //displaying search results inside div.results
    displaySearchResults(e) {
        const results = this.selector('.results');
        this.fetchResults(e.target.previousElementSibling.value)
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                results.innerHTML = '';
                let select = `<select style="width: 100%; text-align: center;">`;
                data.forEach((o, i) => {

                    select += `<option value="[${o.lat + ", " + o.lon}]" ${i === 0 ? 'selected' : ''}>${o.name} , Country: ${o.country}</option>`
                });
                select += '</select>'
                results.innerHTML = select;
            })
            .catch((err) => { console.log(err) });
    }


    disconnectedCallback() {

        this.selector('#submit').removeEventListener('click');
        this.selector('#show').removeEventListener('click');
        this.selector('#toggle').removeEventListener('click');
    }
    //? helper functions
    selector(s) {
        return this.shadowRoot.querySelector(s);
    }


}


function getCurrentLocation() {
    //promisifying geolocation api
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject
        );
    });

}
