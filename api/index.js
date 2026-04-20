const { Telegraf } = require('telegraf');

// التوكن مباشر عشان نقطع الشك باليقين
const bot = new Telegraf('8690355510:AAFMIobn1eE3p0uw48SeMsKNWdn65gso_VA');

bot.start((ctx) => ctx.reply("✅ أخيراً نطقنا يا محمد! السيرفر شغال والربط سليم. طمني؟"));
bot.on('message', (ctx) => ctx.reply("وصلت الرسالة يا هندسة!"));

module.exports = async (req, res) => {
    try {
        if (req.method === 'POST' && req.body) {
            await bot.handleUpdate(req.body);
            return res.status(200).send('OK');
        }
        res.status(200).send('Server is Up!');
    } catch (err) {
        // ده عشان السيرفر ميديناش 500 تانى حتى لو فيه غلطة
        console.error(err);
        res.status(200).send('Error Handled'); 
    }
};
