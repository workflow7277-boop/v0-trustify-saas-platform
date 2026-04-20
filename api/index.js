const { Telegraf } = require('telegraf');

const bot = new Telegraf('8690355510:AAFMIobn1eE3p0uw48SeMsKNWdn65gso_VA');

// الأوامر
bot.start((ctx) => ctx.reply("✅ أخيراً يا محمد! البوت شغال والربط سليم."));
bot.on('text', (ctx) => ctx.reply(`وصلت رسالتك: ${ctx.message.text}`));

module.exports = async (req, res) => {
    // 1. فحص الأمان والـ Live
    if (req.method !== 'POST') {
        return res.status(200).send('Trustify Server is Live 🚀');
    }

    try {
        // 2. معالجة التحديث مباشرة
        await bot.handleUpdate(req.body, res); 
        
        // 3. التأكيد لـ Vercel إن العملية انتهت بنجاح
        if (!res.writableEnded) {
            res.status(200).send('OK');
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(200).send('Error');
    }
};
