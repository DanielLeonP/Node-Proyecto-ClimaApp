const fs = require('fs');
const axios = require("axios");

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //LEER db si existe
        this.leerDB();
    }
    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    async ciudad(lugar = '') {
        try {
            // Peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })

            const resp = await instance.get();

            // console.log(resp.data)

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],

            }));//Lugares donde coincide

        } catch (error) {
            return [];//Lugares no coincidieron
        }
    }

    async climaLugar(lat, lon) {
        try {
            // Instancia axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'appid': process.env.OPENWEATHER_KEY,
                    'lat': lat,
                    'lon': lon,
                    'units': 'metric',
                    'lang': 'es'
                }
            })
            // extraer resp.data
            const resp = await instance.get();
            const { weather, main } = resp.data;

            let desc = weather[0].description;
            let min = main.temp + '°C';
            let max = main.temp_min + '°C';
            let temp = main.temp_max + '°C';
            return {
                desc,
                min,
                max,
                temp
            }
        } catch (error) {
            console.log(error)
        }
    }
    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLowerCase());
        this.guardarDB();
        //Grabar en DB

    }
    guardarDB() {
        const payload = {
            "historial": this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info);

        this.historial = data.historial;
        console.log(this.historial);
    }
    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }
}
module.exports = Busquedas;