
const { Telegraf } = require("telegraf");

const { TOKEN } = require('./Token');

var token = TOKEN;

console.log("La variable token es:", token);


/*
const bot = new Telegraf(TOKEN)


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
*/
