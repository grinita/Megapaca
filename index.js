const { Telegraf } = require("telegraf");
const { obtenerToken, guardarUsuarioEnBD, guardarRespuestaEnBD, obtenerDescuentosPorUsuario } = require('./Token');

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
                [
                    { text: 'Rojo \u{1F534}', callback_data: 'Rojo' },
                    { text: 'Verde \u{1F7E2}', callback_data: 'Verde' },
                    { text: 'Gris \u{1F518}', callback_data: 'Gris' },
                ],
                [
                    { text: 'Negro \u{26AB}', callback_data: 'Negro' },
                    { text: 'Azul \u{1F535}', callback_data: 'Azul' },
                    { text: 'Celeste \u{1F48E}', callback_data: 'Celeste' },
                ],
                [
                    { text: 'Amarillo \u{1F7E1}', callback_data: 'Amarillo' },
                    { text: 'Naranja \u{1F7E0}', callback_data: 'Naranja' },
                    { text: 'Blanco \u{26AA}', callback_data: 'Blanco' },
                ]
            ]
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
        bot.handleUpdate({ message: { text: '/iniciarCarrito', chat: ctx.chat } });
    }
}

async function mostrarDescuentos(ctx) {
    const { id } = ctx.from;

    try {
        const descuentos = await obtenerDescuentosPorUsuario(id);

        if (descuentos.length === 0) {
            ctx.reply('No se encontraron descuentos disponibles.');
            return;
        }

        ctx.reply('Estos son los descuentos disponibles:');

        descuentos.forEach(descuento => {
            ctx.reply(`${descuento.etiqueta} - ${descuento.descuento}% de descuento`);
        });
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
        ctx.reply('Ocurrió un error al obtener los descuentos. Por favor, inténtalo nuevamente más tarde.');
    }
}

async function limpiarCarrito(ctx) {
    const { id } = ctx.from;

    try {
        const descuentos = await obtenerDescuentosPorUsuario(id);

        if (descuentos.length === 0) {
            ctx.reply('No se encontraron descuentos disponibles.');
            return;
        }

        ctx.reply('El carrito se ha limpiado correctamente.');

        // Eliminar el carrito del usuario en la base de datos
        guardarRespuestaEnBD(id, null, null);
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
        ctx.reply('Ocurrió un error al limpiar el carrito. Por favor, inténtalo nuevamente más tarde.');
    }
}

// Crear una nueva instancia de Telegraf
const iniciarBot = async () => {
    const token = await obtenerToken();
    const bot = new Telegraf(token);

    // Comando para iniciar el juego de descuentos
    bot.command('iniciar', (ctx) => {
        const { id, first_name, username } = ctx.from;

        guardarUsuarioEnBD(id, first_name, username);

        preguntaActual = 0;

        // Mostrar la primera pregunta
        mostrarPregunta(ctx, descuentos[preguntaActual]);
    });

    // Comando para mostrar los descuentos disponibles
    bot.command('descuentos', mostrarDescuentos);

    // Comando para limpiar el carrito
    bot.command('limpiar', limpiarCarrito);

    // Manejar la respuesta del usuario
    bot.action(/.*/, (ctx) => {
        manejarRespuesta(ctx, ctx.match[0]);
    });

    // Iniciar el bot
    bot.launch();
};

iniciarBot().catch(error => console.error('Error al iniciar el bot:', error));
