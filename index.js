const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// استدعاء المفاتيح من البيئة
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        const { id, first_name } = ctx.from;
        // تسجيل المستخدم في سوبابيس
        await supabase.from('subscribers').upsert([{ telegram_id: id, shop_name: `${first_name} Store` }]);
        await ctx.reply(`أهلاً بك يا ${first_name} في Trustify! 🚀\nتم تفعيل متجرك بنجاح.`);
    } catch (e) {
        console.error("Supabase Error:", e);
        await ctx.reply("أهلاً بك! البوت يعمل، ولكن هناك مشكلة في الربط بقاعدة البيانات.");
    }
});

// هذا الجزء هو المحرك الخاص بـ Vercel
module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } else {
            res.status(200).send('Trustify Server is Running...');
        }
    } catch (err) {
        console.error("Vercel Error:", err);
        res.status(500).send('Error');
    }
};
