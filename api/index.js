const { Telegraf } = require('telegraf');

// التوكن مباشر عشان نضمن 100% إن مفيش غلط في الـ Variables
const bot = new Telegraf('8690355510:AAFMIobn1eE3p0uw48SeMsKNWdn65gso_VA');

bot.start((ctx) => ctx.reply("✅ أخيراً يا محمد! البوت شغال والربط سليم 100% ."));
bot.on('message', (ctx) => ctx.reply("وصلت الرسالة يا هندسة!"));

module.exports = async (req, res) => {
    // 🛑 الفلتر السحري: لو الطلب مش جاي من تليجرام (مفيهوش update_id) ارفضه بهدوء من غير ما تقع
    if (req.method !== 'POST' || !req.body || !req.body.update_id) {
        return res.status(200).send('Trustify Server is Live 🚀');
    }

    try {
        await bot.handleUpdate(req.body);
        return res.status(200).send('OK');
    } catch (err) {
        console.error("Bot Error:", err);
        return res.status(200).send('Error Handled'); 
    }
};
