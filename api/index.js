const { Telegraf, Sessions } = require('telegraf'); // أضفنا خاصية الجلسات عشان البوت يفتكر أنت بتعمل إيه
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// مصفوفة مؤقتة عشان البوت يفتكر الخطوات (للمبتدئين دي أسهل طريقة)
let userState = {};

bot.start(async (ctx) => {
    // كود التسجيل اللي عملناه قبل كدة (شغال زي ما هو)
    ctx.reply("أهلاً بك! لو عايز تضيف منتج جديد، ابعت كلمة: إضافة");
});

bot.hears('إضافة', (ctx) => {
    userState[ctx.from.id] = { step: 'waiting_for_name' };
    ctx.reply("تمام يا بطل، قولي اسم المنتج إيه؟");
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const state = userState[userId];

    if (state && state.step === 'waiting_for_name') {
        userState[userId].name = ctx.message.text;
        userState[userId].step = 'waiting_for_price';
        ctx.reply(`جميل، منتج "${ctx.message.text}" سعره كام؟`);
    } 
    else if (state && state.step === 'waiting_for_price') {
        const price = parseFloat(ctx.message.text);
        if (isNaN(price)) return ctx.reply("يا محمد، اكتب السعر بالأرقام بس عشان السيستم يفهم.");

        // هنجيب الـ ID بتاعك من جدول المشتركين
        const { data: user } = await supabase.from('subscribers').select('id').eq('telegram_id', userId).single();

        // حفظ المنتج في جدول المنتجات
        const { error } = await supabase.from('products').insert([
            { subscriber_id: user.id, name: state.name, price: price }
        ]);

        if (error) {
            ctx.reply("حصلت مشكلة وأنا بحفظ المنتج: " + error.message);
        } else {
            ctx.reply(`مبروك! منتج "${state.name}" اتضاف بنجاح بسعر ${price} جنيه.`);
        }
        delete userState[userId]; // تصفير الحالة عشان نبدأ من جديد
    }
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
