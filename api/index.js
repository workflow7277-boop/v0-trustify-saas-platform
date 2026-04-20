const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// استدعاء المفاتيح اللي لسه ضايفينها في Vercel
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        const { id, first_name, username } = ctx.from;

        // 1. تسجيل أو تحديث بيانات التاجر في جدول subscribers
        const { error } = await supabase
            .from('subscribers')
            .upsert([
                { 
                    telegram_id: id, 
                    username: username || 'N/A', 
                    shop_name: `${first_name} Store`,
                    created_at: new Date()
                }
            ]);

        if (error) throw error;

        await ctx.reply(`أهلاً بك يا ${first_name} في عائلة Trustify! 🚀\n\nتم تسجيل متجرك بنجاح في قاعدة البيانات. ابدأ الآن بإضافة منتجاتك لبناء إمبراطوريتك.`);
    } catch (e) {
        console.error("Supabase Error:", e.message);
        await ctx.reply("أهلاً بك! البوت شغال، بس فيه تكة في قاعدة البيانات (تأكد من وجود جدول اسمه subscribers).");
    }
});

// استقبال الرسائل النصية للتجربة
bot.on('text', (ctx) => ctx.reply('وصلتني رسالتك وجاري معالجتها في نظام Trustify..'));

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    } else {
        res.status(200).send('<h1>Trustify Server is Online</h1>');
    }
};
