require('dotenv').config()

require('colors');
const { pausaMenu, leerInput, inquirerMenu, listadoLugares } = require("./helpers/inquirer");
const Busqueda = require('./models/busqueda');

const main = async() => {

    const busquedas = new Busqueda();

    let opt;

    do {

        opt = await inquirerMenu();

        switch(opt) {
            case 1:
                //motrar el mensaje
                const buscar = await leerInput('Ciudad: ');
                // buscar lugares
                const lugares = await busquedas.ciudad(buscar);
                //seleccionar lugar
                const idSelection = await listadoLugares(lugares);
                if(idSelection === '0') continue; //para que la aplicacion continue
                const lugar = lugares.find( l => l.id === idSelection );
                //guardar en db
                busquedas.agregarHistorial(lugar.nombre);
                //clima
                const clima = await busquedas.climaLugar(lugar.lat, lugar.lng)
        
                //mostrar resultados
                console.clear();
                console.log('=================================='.blue);
                console.log('=================================='.blue);
                console.log('\nINFORMACION DE LA CIUDAD\n'.green);
                console.log('Ciudad:',lugar.nombre.bgBlue );
                console.log('Lat:',lugar.lat );
                console.log('Lng:',lugar.lng );
                console.log('Temperatura:',clima.temp, '°C');
                console.log('Minima:',clima.min, '°C' );
                console.log('Maxima:',clima.max, '°C' );
                console.log('Descricion del Clima:',clima.desc.bgBlue );
                console.log('\n=================================='.blue);
                console.log('=================================='.blue);

            break;

            case 2: 
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.blue;
                    console.log( `${ idx } ${ lugar }`);
                });
            break;
        }

        await pausaMenu();

    } while ( opt !== 0 );


}

main();