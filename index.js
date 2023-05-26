const { Telegraf } = require("telegraf");
const { obtenerToken, guardarUsuarioEnBD, guardarRespuestaEnBD } = require('./Token');

// Arreglo de colores
const colores = ['Rojo', 'Verde', 'Gris', 'Negro', 'Azul', 'Celeste', 'Amarillo', 'Naranja', 'Blanco'];

// Arreglo de descuentos
const descuentos = [0, 15, 30, 40, 50, 60, 70, 80, 90];

// Índice de la pregunta actual
let preguntaActual = 0;

// Función para mostrar una pregunta y el menú de opciones
function mostrarPregunta(ctx, pregunta) {
    const { id } = ctx.from;

    // Verificar si es una pregunta de descuento o de precio normal
    const preguntaText = pregunta !== 0 ? `¿Qué etiqueta tiene ${pregunta}% de descuento?` : '¿Qué etiqueta está a precio normal?';

    ctx.reply(preguntaText, {
        reply_markup: {
            inline_keyboard: [
                colores.map((color) => ({ text: color, callback_data: color })),
            ],
        },
    });

    // Guardar la pregunta en la base de datos
    guardarRespuestaEnBD(id, pregunta, null);
}

// Función para manejar la respuesta del usuario
function manejarRespuesta(ctx, respuesta) {
    const { id } = ctx.from;
    const pregunta = descuentos[preguntaActual];

    // Guardar la respuesta en la base de datos
    guardarRespuestaEnBD(id, pregunta, respuesta);

    preguntaActual++;

    if (preguntaActual < descuentos.length) {
        // Mostrar la siguiente pregunta
        mostrarPregunta(ctx, descuentos[preguntaActual]);
    } else {
        // Se completaron todas las preguntas
        ctx.reply('Has completado todos los descuentos, empieza a agregar ropa a tu carrito :)');
    }
}

(async () => {
    const token = await obtenerToken();

    const bot = new Telegraf(token);

    bot.command(['start', 'empezar', 'inicio', 'iniciar'], (ctx) => {
        // Obtener datos del usuario
        const { id, first_name, last_name } = ctx.from;
        const username = first_name + (last_name ? ' ' + last_name : '');

        // Guardar usuario en la base de datos
        guardarUsuarioEnBD(id, first_name, last_name);

        // Enviar mensaje de bienvenida
        ctx.reply(`¡Hola ${username}! Bienvenido(a) al bot.`);

        // Iniciar las preguntas y desplegar el menú
        preguntaActual = 0;
        mostrarPregunta(ctx, descuentos[preguntaActual]);
    });

    bot.action(colores, (ctx) => {
        const respuesta = ctx.callbackQuery.data;

        // Manejar la respuesta del usuario
        manejarRespuesta(ctx, respuesta);

        ctx.answerCbQuery();
    });


    bot.command('test', ctx => {
        bot.telegram.sendMessage(ctx.chat.id, 'Agregar descuento de etiqueta',
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Rojo \u{1F534}', callback_data: 'red' },
                            { text: 'Verde \u{1F7E2}', callback_data: 'green' },
                            { text: 'Gris \u{1F518}', callback_data: 'gray' },
                        ],
                        [
                            { text: 'Negro \u{26AB}', callback_data: 'black' },
                            { text: 'Azul \u{1F535}', callback_data: 'blue' },
                            { text: 'Celeste \u{1F48E}', callback_data: 'bblue' },
                        ],
                        [

                            { text: 'Amarillo \u{1F7E1}', callback_data: 'yellow' },
                            { text: 'Naranja \u{1F7E0}', callback_data: 'orange' },
                            { text: 'Blanco \u{26AA}', callback_data: 'white' },
                        ]
                    ]
                }
            })
    })

    bot.action('red', ctx => {
        ctx.answerCbQuery();
        bot.telegram.sendMessage(ctx.chat.id, '¿Qué descuento tiene la etiqueta roja?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [


                            { text: 'Precio normal', callback_data: 'red' },
                            { text: '15%', callback_data: 'green' },
                        ],
                        [
                            { text: '30%', callback_data: 'black' },
                            { text: '50%', callback_data: 'blue' },
                            { text: '60%', callback_data: 'bblue' },
                        ],
                        [

                            { text: '70%', callback_data: 'yellow' },
                            { text: '80%', callback_data: 'orange' },
                            { text: '90%', callback_data: 'white' },
                        ]
                    ]
                }
            })
    })

    bot.launch()
})();




