const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    return ctx.reply("أهلاً بك يا محمد! أنا شغال دلوقتي من Vercel 🚀");
});

module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } else {
            res.status(200).send('Bot is online!');
        }
    } catch (err) {
        res.status(500).send('Error');
    }
};
