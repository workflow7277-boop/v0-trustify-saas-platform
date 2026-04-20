const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_ID = 5809716918; 

// --- واجهة الدخول ---
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    
    if (userId === ADMIN_ID) {
        return ctx.reply("👑 **مكتب المالك (Admin)**\nأهلاً يا هندسة، المنصة تحت سيطرتك.", 
            Markup.keyboard([['قائمة التجار', 'حالة السيستم'], ['إعدادات المنصة']]).resize()
        );
    }

    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();
    if (merchant && merchant.status === 'active') {
        return ctx.reply(`🏪 **غرفة عمليات: ${merchant.shop_name}**\nوضب محلك وبضاعتك من هنا:`, 
            Markup.keyboard([['إضافة منتج ➕', 'مخزني 📦'], ['معاينة الفاترينا 👁️']]).resize()
        );
    }

    // واجهة الزبون (الفاترينا)
    return ctx.replyWithPhoto(
        'https://via.placeholder.com/800x400.png?text=Trustify+Store', // صورة غلاف المحل
        {
            caption: "✨ **مرحباً بك في Trustify** ✨\n\nتفضل بتصفح أجود المنتجات المتاحة في متجرنا.",
            ...Markup.inlineKeyboard([[Markup.button.callback('🛍️ دخول المتجر', 'show_products')]])
        }
    );
});

// --- تشطيب الفاترينا (عرض المنتجات كـ كروت) ---
bot.action('show_products', async (ctx) => {
    const { data: products } = await supabase.from('products').select('*');

    if (!products || products.length === 0) {
        return ctx.answerCbQuery('المحل لسه بيتفرش، ارجع كمان شوية! 🏗️', { show_alert: true });
    }

    await ctx.reply("👇 **إليك أحدث المنتجات في الفاترينا:**");

    for (const p of products) {
        // لو المنتج له صورة بنعرضها، لو ملوش بنحط صورة افتراضية شيك
        const image = p.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image';
        
        await ctx.replyWithPhoto(image, {
            caption: `📦 *${p.name}*\n\n📝 ${p.description || 'لا يوجد وصف متاح لهذا المنتج.'}\n\n💰 **السعر:** \`${p.price} جنيه\``,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🛒 إضافة للسلة', `buy_${p.id}`)]
            ])
        });
    }
    await ctx.answerCbQuery();
});

// --- إضافة المنتج (دلوقتي بقت تطلب الاسم والسعر) ---
bot.hears('إضافة منتج ➕', (ctx) => {
    ctx.reply("تمام يا بطل، ابعت المنتج كدة: (الاسم - السعر)");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.includes('-')) {
        const [name, priceStr] = text.split('-').map(s => s.trim());
        const price = parseFloat(priceStr);
        if (isNaN(price)) return ctx.reply("❌ السعر لازم يكون أرقام.");

        const { data: user } = await supabase.from('subscribers').select('id').eq('telegram_id', ctx.from.id).single();
        await supabase.from('products').insert([{ subscriber_id: user.id, name: name, price: price }]);
        ctx.reply(`✅ تم وضع "${name}" في المخزن.\n(في المرحلة الجاية هنخليك تضيف صورة ووصف كمان 😉)`);
    }
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
