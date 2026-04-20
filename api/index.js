const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// رسالة الترحيب والتعليمات
const helpMessage = `🏪 نظام Trustify لإدارة المتجر:

1️⃣ لإضافة منتج: (اسم المنتج - السعر)
   مثال: قميص - 350

2️⃣ لعرض المنتجات: اكتب "عرض"

3️⃣ لمسح منتج: اكتب "مسح" وبعده اسم المنتج
   مثال: مسح قميص`;

bot.start((ctx) => ctx.reply(helpMessage));

// --- 1. وظيفة العرض ---
bot.hears('عرض', async (ctx) => {
    try {
        const { data: user } = await supabase.from('subscribers').select('id').eq('telegram_id', ctx.from.id).single();
        const { data: products, error } = await supabase.from('products').select('name, price').eq('subscriber_id', user.id);
        
        if (products.length === 0) return ctx.reply("مخزنك فاضي حالياً.");

        let list = "📦 منتجاتك المتوفرة:\n\n";
        products.forEach(p => list += `🔹 ${p.name} ⬅️ ${p.price} جنيه\n`);
        ctx.reply(list);
    } catch (e) { ctx.reply("خطأ في جلب البيانات."); }
});

// --- 2. وظيفة المسح ---
bot.hears(/^مسح (.+)/, async (ctx) => {
    const productName = ctx.match[1].trim();
    try {
        const { data: user } = await supabase.from('subscribers').select('id').eq('telegram_id', ctx.from.id).single();
        const { error } = await supabase.from('products').delete().eq('subscriber_id', user.id).eq('name', productName);
        
        if (error) throw error;
        ctx.reply(`🗑️ تم حذف منتج "${productName}" من مخزنك.`);
    } catch (e) { ctx.reply("حصل خطأ أثناء المسح."); }
});

// --- 3. وظيفة الإضافة العامة ---
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.includes('-')) {
        const [name, priceStr] = text.split('-').map(s => s.trim());
        const price = parseFloat(priceStr);
        if (isNaN(price)) return ctx.reply("⚠️ السعر لازم يكون أرقام.");

        try {
            const { data: user } = await supabase.from('subscribers').select('id').eq('telegram_id', ctx.from.id).single();
            const { error } = await supabase.from('products').insert([{ subscriber_id: user.id, name: name, price: price }]);
            if (error) throw error;
            ctx.reply(`✅ تم إضافة "${name}" بنجاح.`);
        } catch (e) { ctx.reply("⚠️ مشكلة في الإضافة."); }
    } else if (text !== 'عرض' && !text.startsWith('مسح')) {
        ctx.reply("مش فاهمك يا محمد، ابعت (اسم المنتج - السعر) أو اكتب 'عرض'.");
    }
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
