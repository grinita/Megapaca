
const { Telegraf } = require("telegraf");

var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "change-me",
    database: "megapaca"
  });
/*
const TOKEN = con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM constantes", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]["token"]);
        return result[0]["token"];
    });
});;
*/
async function getToken() {
  try {
    const results = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM constantes', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Manejar los resultados de la consulta
    console.log(results);
  } catch (error) {
    // Manejar el error de la consulta
    console.error(error);
  }
}

let TOKEN; // Declarar una variable global para almacenar el token

async function obtenerToken() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getToken());
    }, 2000);
  });
}

async function obtenerYGuardarToken() {
  try {
    const result = await obtenerToken();
    TOKEN = result[0].token;
    console.log(TOKEN); // Imprimirá '5948828258:AAEt_LpxxEmMkFXjvTIqo1Iq3PIfGkSZARI'
    // Puedes realizar otras operaciones con el TOKEN aquí
  } catch (error) {
    console.error(error);
  }
}

obtenerYGuardarToken();

console.log("El Token: " + TOKEN);
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
