const { Telegraf } = require('telegraf');

const bot = new Telegraf('8690355510:AAFMIobn1eE3p0uw48SeMsKNWdn65gso_VA');

bot.start((ctx) => ctx.reply("✅ مبروك يا محمد! نقلنا لـ Render والبوت اشتغل أخيراً."));
bot.on('text', (ctx) => ctx.reply(`وصلت رسالتك على السيرفر الجديد: ${ctx.message.text}`));

// تشغيل البوت مباشرة
bot.launch().then(() => {
    console.log("Bot is running on Render...");
});

// لمنع السيرفر من التوقف
const http = require('http');
http.createServer((req, res) => {
    res.write('Trustify is Live on Render!');
    res.end();
}).listen(process.env.PORT || 3000);
