
const inquirer = require('inquirer');
require('colors');

const question = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.blue} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.blue} Historial`
            },
            {
                value: 0,
                name: `${'0.'.blue} Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    
    // console.clear();
    console.log('=================================='.blue);
    console.log('       Seleccione una opción:     '.bgMagenta)
    console.log('==================================\n'.blue);

    const { opcion } = await inquirer.prompt(question);

    return opcion;
}

const pausaMenu = async() => {

    const continuar = [
        {
            value: 'input',
            name: 'enter',
            message: `Precione ${'ENTER'.blue} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(continuar);

}

const leerInput = async( message ) => {
    
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listadoLugares = async( lugares = []) => {

    const choices = lugares.map( ( lugar, i )=> {

        const idx = `${i +1}`.blue;

        return {
            value: lugar.id,
            name: `${idx} ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.blue + 'Cancelar'
    });

    const question = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices

        }
    ]
    const { id } = await inquirer.prompt( question );

    return id;

}

const confirmar = async( message ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];


    const { ok } = await inquirer.prompt( question );

    return ok;
}

const mostrarCheckList = async( tareas = []) => {

    const choices = tareas.map( ( tarea, i )=> {

        const idx = `${i +1}`.blue;

        return {
            value: tarea.id,
            name: `${idx} ${ tarea.desc }`,
            checked: (tarea.completadoEn)
                        ? true
                        : false
        }
    });
    
    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices

        }
    ]
    const { ids } = await inquirer.prompt( question );

    return ids;

}


module.exports = {
    inquirerMenu,
    pausaMenu,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarCheckList
}