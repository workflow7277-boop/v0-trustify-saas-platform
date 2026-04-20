const { Telegraf } = require('telegraf');

// استخدام التوكن مباشرة للتجربة القاطعة
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('تم بنجاح! السيرفر استلم الرسالة ويرد عليك الآن 🚀'));
bot.on('text', (ctx) => ctx.reply('وصلتني رسالتك: ' + ctx.message.text));

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error in bot');
        }
    } else {
        res.status(200).send('<h1>Bot is running...</h1>');
    }
};
