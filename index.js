const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    const { id, first_name } = ctx.from;
    const { error } = await supabase
        .from('subscribers')
        .upsert([{ telegram_id: id, shop_name: `${first_name} Store` }], { onConflict: 'telegram_id' });

    if (error) {
        return ctx.reply("أهلاً بك! هناك مشكلة بسيطة في الربط، تأكد من إعدادات السيرفر.");
    }

    ctx.reply(`أهلاً بك يا ${first_name} في Trustify! 🚀\n\nتم تفعيل متجرك التجريبي بنجاح.`);
});

bot.launch().then(() => console.log("Bot is running!"));
