require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

require("colors")


const main = async () => {
    const busquedas = new Busquedas();
    let opt = '';
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad:');
                //Buscar lugares
                const lugares = await busquedas.ciudad(termino);


                //Seleccionar lugar
                const idSeleccionado = await listarLugares(lugares);

                if (idSeleccionado === '0') continue;

                const lugarSel = lugares.find(l => l.id === idSeleccionado);
                // console.log(lugarSel);


                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima del lugar
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.log('\nInformacion de la ciudad\n'.blue);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Cómo está el clima:', clima.desc);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}`.blue;
                    console.log(`${idx}. ${lugar}`);
                })
                break;
            default:
                break;
        }
        await pausa();
    } while (opt != 0);

}

main();