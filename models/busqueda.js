const fs  = require('fs');
const axios = require('axios');

class Busqueda{

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        //capitalizar cada palabra

        return this.historial.map( lugar => {
            //dividimos en parte por separado
            let palabra = lugar.split(' ');
            //recorremos cada palabra y tomamo la primera posicion y convertimos
            // posterior unicomo con subString a partir del sobrante
            palabra = palabra.map( p => p[0].toUpperCase() + p.substring(1));
            // retornamos y unimos la pallabra con join cada espacio
            return palabra.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '') {
        //peticion http 
        try {
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
                
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ) {
        try {

            const instanc= axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsOpenWeather,
                    lat,
                    lon
                }
            });
          
            const res = await instanc.get();
            //desestructuracion de objeto y array (accede al objeto 
            //usando la posicion y nombre)
            const { weather, main } = res.data;
            
            return {
                    desc: weather[0].description,     
                    min: main.temp_min,
                    max: main.temp_max,
                    temp: main.temp
                } 

        } catch (error) {
            console.log('no se encontro el lugar');
        }
    }

    agregarHistorial( lugar = '' )  {
        //TODO: prevenir duplicados
        //validamos existencia 
        if( this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }
        //limite en el historial
        this.historial = this.historial.splice(0,5);
        //agregar al inicio del arreglo
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en db
        this.guardarDB();
    }

    guardarDB() {
        
        const payload = {
            historial: this.historial        
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    };

    

    leerDB() {
        
        if(!fs.existsSync( this.dbPath )) {
            return;
        }

        //leermos si existe el dbpathu recibimos con string
        const info = fs.readFileSync( this.dbPath , {
            encoding: 'utf-8'
        });
        //convertir el archivo a json
        const data = JSON.parse( info );
        //cargar el historial
        this.historial = data.historial; 
    }




}

module.exports = Busqueda;