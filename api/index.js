const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_ID = 5809716918; // رقم تليجرام بتاعك

bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // 1. واجهة المالك (مكتبك المخفي)
    if (userId === ADMIN_ID) {
        return ctx.reply("أهلاً يا مستر محمد (المالك) 👑\nمكتبك جاهز، تحب تتابع إيه؟", 
            Markup.keyboard([['قائمة التجار', 'حالة السيستم']]).resize()
        );
    }

    // 2. واجهة التاجر (غرفة العمليات)
    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();
    if (merchant && merchant.status === 'active') {
        return ctx.reply(`أهلاً يا ${merchant.shop_name} 🏪\nدي غرفة عمليات متجرك:`, 
            Markup.keyboard([['إضافة منتج ➕', 'مخزني 📦'], ['عرض متجري للجمهور 👁️']]).resize()
        );
    }

    // 3. واجهة الزبون (واجهة المحل)
    return ctx.reply("✨ مرحباً بك في Trustify ✨\nتفضل بزيارة متجرنا واكتشف أحدث المنتجات:", 
        Markup.inlineKeyboard([
            [Markup.button.callback('🛍️ تصفح الكتالوج', 'show_products')]
        ])
    );
});

// --- منطق عرض المنتجات للزبون ---
bot.action('show_products', async (ctx) => {
    const { data: products } = await supabase.from('products').select('name, price, description');

    if (!products || products.length === 0) {
        return ctx.answerCbQuery('المحل فاضي حالياً، بنفرش بضاعة جديدة! 🏗️');
    }

    let catalog = "🛒 بضاعتنا المتوفرة:\n\n";
    products.forEach((p, i) => {
        catalog += `${i+1}- *${p.name}*\n💰 السعر: ${p.price} جنيه\n📝 ${p.description || 'لا يوجد وصف'}\n\n`;
    });

    await ctx.replyWithMarkdown(catalog);
    await ctx.answerCbQuery();
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
