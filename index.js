const { Telegraf } = require("telegraf");
const { obtenerToken, guardarUsuarioEnBD, guardarRespuestaEnBD, obtenerDescuentosPorUsuario, getDescuento, insertRegistro, getRegistrosCarrito, deleteRegistroCarrito } = require('./Token');

// Arreglo de colores
const colores = ['rojo', 'verde', 'gris', 'negro', 'azul', 'celeste', 'amarillo', 'naranja', 'blanco'];

// Arreglo de descuentos
const descuentos = [0, 15, 30, 50, 60, 70, 80, 90];

// Índice de la pregunta actual
let preguntaActual = 0;

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para mostrar una pregunta y el menú de opciones
function mostrarPregunta(ctx, pregunta) {
    const { id } = ctx.from;

    // Verificar si es una pregunta de descuento o de precio normal
    const preguntaText = pregunta !== 0 ? `¿Qué etiqueta tiene ${pregunta}% de descuento?` : '¿Qué etiqueta está a precio normal?';

    ctx.reply(preguntaText, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Rojo \u{1F534}', callback_data: 'rojo' },
                    { text: 'Verde \u{1F7E2}', callback_data: 'verde' },
                    { text: 'Gris \u{1F518}', callback_data: 'gris' },
                ],
                [
                    { text: 'Negro \u{26AB}', callback_data: 'negro' },
                    { text: 'Azul \u{1F535}', callback_data: 'azul' },
                    { text: 'Celeste \u{1F48E}', callback_data: 'celeste' },
                ],
                [
                    { text: 'Amarillo \u{1F7E1}', callback_data: 'amarillo' },
                    { text: 'Naranja \u{1F7E0}', callback_data: 'naranja' },
                    { text: 'Blanco \u{26AA}', callback_data: 'blanco' },
                ]
            ]
        },
    });

    // Guardar la pregunta en la base de datos
    guardarRespuestaEnBD(id, pregunta, null);
}

// Función para manejar la respuesta del usuario
function manejarRespuesta(ctx, respuesta, bot) {
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
        bot.handleUpdate({ message: { text: 'iniciarCarrito', chat: ctx.chat } });
    }
}

async function mostrarDescuentos(ctx) {
    const { id } = ctx.from;

    try {
        const descuentos = await obtenerDescuentosPorUsuario(id);

        if (descuentos.length === 0) {
            ctx.reply('No se encontraron descuentos para tu usuario.');
            //bot.handleUpdate({ message: { text: '/limpiar', chat: ctx.chat } });
        } else {
            ctx.reply('Estos son tus descuentos:');
            descuentos.forEach((descuento) => {
                ctx.reply(`- ${descuento.color}: ${descuento.porcentaje}%`);
            });
        }
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
        ctx.reply('Ocurrió un error al obtener los descuentos. Por favor, intenta nuevamente más tarde.');
    }
}

async function iniciarBot() {
    const token = await obtenerToken();

    const bot = new Telegraf(token);

    bot.command(['start', 'empezar', 'inicio', 'iniciar'], async (ctx) => {
        // Obtener datos del usuario
        const { id, first_name, last_name } = ctx.from;
        const username = first_name + (last_name ? ' ' + last_name : '');

        // Guardar usuario en la base de datos
        guardarUsuarioEnBD(id, first_name, last_name);

        // Enviar mensaje de bienvenida
        ctx.reply(`¡Hola ${username}! Bienvenido(a) al bot.`);

        try {
            const descuentos = await obtenerDescuentosPorUsuario(id);

            if (descuentos.length === 0) {
                ctx.reply('No se encontraron descuentos para tu usuario.');
                bot.handleUpdate({ message: { text: '/limpiar', chat: ctx.chat } });
            } else {
                await ctx.reply('Estos son tus descuentos:');
                await descuentos.forEach(async (descuento) => {
                    await ctx.reply(`- ${capitalizeFirstLetter(descuento.color)}: ${descuento.porcentaje}%`);
                });

                const keyboard = [
                    [{ text: 'Sí, quiero empezar la lista de nuevo', callback_data: 'limpiar' }],
                    [{ text: 'No, los descuentos de la lista son correctos', callback_data: 'iniciarCarrito' }]
                ];

                await ctx.reply('¿Desea limpiar la lista de descuentos?', { reply_markup: { inline_keyboard: keyboard } });
            }

        } catch (error) {
            console.error('Error al obtener los descuentos:', error);
            ctx.reply('Ocurrió un error al obtener los descuentos. Por favor, intenta nuevamente más tarde.');
        }

    });

    bot.action('iniciarCarrito', (ctx) => {
        ctx.reply(`¡Inicia tu carrito!
        -Ingresa /agregar <descripcion de la prenda>, <precio en la etiqueta>, <color de la etiqueta> para agregar algo al carrito. Ejemplo: Encontraste una blusa blanca con etiqueta roja que dice Q15, ingresa: */agregar blusa blanca, 15, rojo*
        -Ingresa /carrito para mostrar lo que llevas en el carrito y el total.
        -Ingresa /sacar <identificador> para sacar algo del carrito. El identificador se puede encontrar ingresando /carrito. Ejemplo: Quieres eliminar el articulo con identificador 653: */sacar 653*
        -Ingresa /reiniciar para empezar de nuevo con el carrito vacío
        -Ingresa /total para tener solamente el total de tu carrito, sin especificacion de los productos`);
    });

    bot.action('limpiar', (ctx) => {
        ctx.answerCbQuery();
        ctx.reply('Limpieza realizada. Lista de descuentos eliminada.');

        preguntaActual = 0;
        mostrarPregunta(ctx, descuentos[preguntaActual]);
    });

    bot.action('descuentos', (ctx) => {
        ctx.answerCbQuery();
        ctx.reply('Accediendo a la lista de descuentos existente.');
        bot.handleUpdate({ message: { text: '/descuentos', chat: ctx.chat } });
        bot.handleUpdate({ message: { text: '/limpiar', chat: ctx.chat } });
    });

    bot.command('limpiar', (ctx) => {
        // Iniciar las preguntas y desplegar el menú
        preguntaActual = 0;
        mostrarPregunta(ctx, descuentos[preguntaActual]);
    });

    bot.action(colores, (ctx) => {
        const respuesta = ctx.callbackQuery.data;

        // Manejar la respuesta del usuario
        manejarRespuesta(ctx, respuesta, bot);

        ctx.answerCbQuery();
    });

    bot.command('descuentos', mostrarDescuentos);

    bot.command('xx', ctx => {
        bot.telegram.sendMessage(ctx.chat.id, 'Agregar descuento de etiqueta', {
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
        });
    });

    bot.action('menudescuentos', ctx => {
        ctx.answerCbQuery();
        bot.telegram.sendMessage(ctx.chat.id, '¿Qué descuento tiene la etiqueta roja?', {
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
        });
    });


    // Comando /agregar
    bot.command('agregar', async (ctx) => {
        const userId = ctx.message.from.id;
        const messageText = ctx.message.text;

        // Extraer los valores ingresados por el usuario
        const [descripcion, precio, color] = messageText.split(',');

        try {
            // Obtener el descuento
            const descuento = await getDescuento(userId, color.replace(" ","").toLowerCase());
            console.log("descuento encontrado: "+descuento)

            // Calcular el precio final con descuento
            const precioFinal = parseFloat(precio) - ((parseFloat(precio) * descuento) / 100);

            // Insertar el registro en el carrito
            await insertRegistro(userId, descripcion.replace("/agregar ",""), precio, descuento, precioFinal, color);

            ctx.reply('Se ha agregado el producto al carrito.');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            ctx.reply('Ocurrió un error al agregar el producto.');
        }
    });

    // Comando /carrito
    bot.command('carrito', async (ctx) => {
        const userId = ctx.message.from.id;

        try {
            // Obtener los registros del carrito
            const registros = await getRegistrosCarrito(userId);

            // Construir el mensaje de respuesta
            let message = 'Carrito de compras:\n\n';

            if (registros.length > 0) {
                for (const registro of registros) {
                    message += `IDENTIFICADOR: ${registro.id}\n`;
                    message += `DESCRIPCIÓN: ${registro.descripcion}\n`;
                    message += `PRECIO CON DESCUENTO: ${registro.precio_final} (PRECIO EN LA ETIQUETA: ${registro.precio_normal})\n`;
                    message += `DESCUENTO: ${registro.descuento}\n`;
                    message += `COLOR ETIQUETA: ${capitalizeFirstLetter(registro.color)}\n\n`;
                    message += '--------------------------------------------------------------------';
                }
            } else {
                message += 'El carrito está vacío.';
            }

            ctx.reply(message);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            ctx.reply('Ocurrió un error al obtener el carrito.');
        }
    });

    // Comando /sacar
    bot.command('sacar', async (ctx) => {
        const userId = ctx.message.from.id;
        const messageText = ctx.message.text;

        // Extraer el identificador ingresado por el usuario
        const [, identificador] = messageText.split(' ');

        try {
            // Eliminar el registro del carrito
            await deleteRegistroCarrito(identificador, userId);

            ctx.reply('Se ha eliminado el producto del carrito.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            ctx.reply('Ocurrió un error al eliminar el producto.');
        }
    });

    // Comando /reiniciar
    bot.command('reiniciar', async (ctx) => {
        const userId = ctx.message.from.id;

        try {
            // Eliminar todos los registros del carrito
            await deleteRegistroCarrito(null, userId);

            ctx.reply('Se ha reiniciado el carrito.');
        } catch (error) {
            console.error('Error al reiniciar el carrito:', error);
            ctx.reply('Ocurrió un error al reiniciar el carrito.');
        }
    });

    // Iniciar el bot
    bot.launch().then(() => {
        console.log('Bot de Telegram iniciado');
    }).catch((error) => {
        console.error('Error al iniciar el bot de Telegram:', error);
    });
}

iniciarBot();




