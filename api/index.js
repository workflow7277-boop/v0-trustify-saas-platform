const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        const { id, first_name, username } = ctx.from;

        // محاولة إدخال البيانات
        const { error } = await supabase
            .from('subscribers')
            .upsert({ 
                telegram_id: id, 
                username: username || 'N/A', 
                shop_name: `${first_name} Store`
            }, { onConflict: 'telegram_id' });

        if (error) {
            // لو فيه خطأ، ابعت رسالة الخطأ الحقيقية عشان نفهمها
            return ctx.reply(`خطأ في قاعدة البيانات: ${error.message}\nكود الخطأ: ${error.code}`);
        }

        await ctx.reply(`أهلاً بك يا ${first_name} في عائلة Trustify! 🚀\n\nتم تسجيل متجرك بنجاح في قاعدة البيانات.`);
    } catch (e) {
        await ctx.reply("حدث خطأ غير متوقع في السيرفر.");
    }
});

bot.on('text', (ctx) => ctx.reply('رسالتك وصلت للسيرفر، جاري العمل على نظام Trustify..'));

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } catch (err) {
            res.status(500).send('Error');
        }
    } else {
        res.status(200).send('Trustify Server Running');
    }
};
