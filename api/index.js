const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("أهلاً يا محمد! عشان تضيف منتج جديد، ابعت رسالة بالشكل ده:\nاسم المنتج - السعر\n\nمثال:\nتيشرت - 200"));

// كود بسيط جداً بيفهم الرسالة لو فيها علامة الـ (-)
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    if (text.includes('-')) {
        const parts = text.split('-');
        const productName = parts[0].trim();
        const productPrice = parseFloat(parts[1].trim());

        if (isNaN(productPrice)) {
            return ctx.reply("يا محمد، اكتب السعر صح بعد علامة الـ (-) .. لازم يكون رقم.");
        }

        try {
            // 1. بنجيب الـ ID بتاعك من سوبابيس
            const { data: user } = await supabase
                .from('subscribers')
                .select('id')
                .eq('telegram_id', ctx.from.id)
                .single();

            // 2. بنضيف المنتج في الجدول
            const { error } = await supabase.from('products').insert([
                { subscriber_id: user.id, name: productName, price: productPrice }
            ]);

            if (error) throw error;

            ctx.reply(`✅ تم إضافة "${productName}" بسعر ${productPrice} جنيه بنجاح!`);
        } catch (e) {
            ctx.reply("حصل خطأ: تأكد إنك عملت جدول products في سوبابيس.");
        }
    } else {
        ctx.reply("مش فاهمك يا محمد، ابعت اسم المنتج وبعده سعره وبينهم علامة (-)");
    }
});

module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (e) {
        res.status(200).send('Error'); // بنرجع 200 عشان فيرسل ميعلقش
    }
};
