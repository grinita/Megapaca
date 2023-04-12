const Telebot = require("telebot")
const CONSTANTS = require("./constants")

const bot = new Telebot({
    token: CONSTANTS.TELEGRAM_TOKEN
})

bot.on(["/start","/hola"], (msg)=>{
    bot.sendMessage(msg.chat.id, `Hola ${msg.chat.first_name}, bienvenido a tu primer bot`)
})

bot.on(["/ingresar"],(msg)=>{
    let cantidad = parseFloat(msg.text.replace("/ingresar","").replace(" ",""))
    bot.sendMessage(msg.chat.id, `Se ingresó ${cantidad} a la base`)
})


bot.start()