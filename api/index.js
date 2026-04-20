const { Telegraf } = require('telegraf');

// استخدم التوكن مباشرة عشان نقطع الشك باليقين في الـ Environment Variables
const bot = new Telegraf('8690355510:AAFMIobn1eE3p0uw48SeMsKNWdn65gso_VA');

bot.start((ctx) => {
    console.log("Start command received");
    return ctx.reply("✅ Trustify يعمل بنجاح يا محمد! إحنا كدة عدينا مرحلة الربط.");
});

bot.on('message', (ctx) => {
    return ctx.reply("وصلت الرسالة!");
});

module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
            return res.status(200).send('OK');
        }
        res.status(200).send('Server is running!');
    } catch (err) {
        console.error("CRITICAL ERROR:", err);
        res.status(200).send('Error but keeping server alive'); // عشان ميديناش 500 تاني
    }
};
