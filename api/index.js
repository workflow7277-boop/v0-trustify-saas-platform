const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("أهلاً يا محمد! ابعت المنتج كدة:\nاسم المنتج - السعر"));

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    if (text.includes('-')) {
        const [name, priceStr] = text.split('-').map(s => s.trim());
        const price = parseFloat(priceStr);

        if (isNaN(price)) return ctx.reply("اكتب السعر أرقام بس يا محمد.");

        try {
            // هنجيب بياناتك برقم تليجرام بتاعك مباشرة
            const { data: user, error: userError } = await supabase
                .from('subscribers')
                .select('id')
                .eq('telegram_id', ctx.from.id)
                .maybeSingle(); // استخدمنا maybeSingle عشان نضمن الدقة

            if (!user) return ctx.reply("مش لاقي حسابك، ابعت /start الأول.");

            // إضافة المنتج
            const { error: prodError } = await supabase.from('products').insert([
                { subscriber_id: user.id, name: name, price: price }
            ]);

            if (prodError) throw prodError;

            ctx.reply(`✅ مبروك! "${name}" اتضاف في المخزن بنجاح.`);
        } catch (e) {
            ctx.reply(`فيه مشكلة في الربط: ${e.message}`);
        }
    }
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
