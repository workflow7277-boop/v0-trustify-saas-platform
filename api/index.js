const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_ID = 5809716918; 

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    if (userId === ADMIN_ID) {
        return ctx.reply("أهلاً يا مستر محمد 👑\nمكتبك الإداري جاهز:", 
            Markup.keyboard([['قائمة التجار', 'حالة السيستم']]).resize()
        );
    }
    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();
    if (merchant && merchant.status === 'active') {
        return ctx.reply(`أهلاً يا ${merchant.shop_name} 🏪\nدي غرفة عمليات متجرك:`, 
            Markup.keyboard([['إضافة منتج ➕', 'مخزني 📦']]).resize()
        );
    }
    return ctx.reply("✨ مرحباً بك في Trustify ✨", Markup.inlineKeyboard([[Markup.button.callback('🛍️ تصفح الكتالوج', 'show_products')]]));
});

// --- تفعيل زرار قائمة التجار (خاص بك فقط) ---
bot.hears('قائمة التجار', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const { data: subs, error } = await supabase.from('subscribers').select('shop_name, status, plan');
    
    if (error || !subs) return ctx.reply("فيه مشكلة في سحب بيانات التجار.");
    
    let report = "👥 قائمة التجار المشتركين:\n\n";
    subs.forEach((s, i) => {
        report += `${i+1}- المحل: ${s.shop_name}\n   الحالة: ${s.status === 'active' ? '✅ مفعل' : '❌ معطل'}\n   الباقة: ${s.plan}\n\n`;
    });
    ctx.reply(report);
});

// --- تفعيل زرار حالة السيستم (خاص بك فقط) ---
bot.hears('حالة السيستم', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    
    // هنجيب شوية إحصائيات سريعة
    const { count: userCount } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    const statusMsg = `📊 تقرير حالة نظام Trustify:\n\n` +
                      `✅ السيرفر: متصل (Vercel)\n` +
                      `🗄️ قاعدة البيانات: متصلة (Supabase)\n` +
                      `👥 إجمالي التجار: ${userCount || 0}\n` +
                      `📦 إجمالي المنتجات: ${productCount || 0}\n` +
                      `📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}`;
    
    ctx.reply(statusMsg);
});

// --- تصفح الكتالوج للزبائن ---
bot.action('show_products', async (ctx) => {
    const { data: products } = await supabase.from('products').select('name, price');
    if (!products || products.length === 0) return ctx.answerCbQuery('المحل فاضي حالياً!');
    let catalog = "🛒 بضاعتنا المتوفرة:\n\n";
    products.forEach(p => catalog += `▪️ ${p.name} ⬅️ ${p.price} جنيه\n`);
    await ctx.reply(catalog);
    await ctx.answerCbQuery();
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
