const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// الرابط بتاعك من الصورة
const APP_URL = "https://v0-trustify-saas-platform-git-main-workflow7277-boops-projects.vercel.app"; 
const ADMIN_ID = 5809716918;

bot.start(async (ctx) => {
    const userId = ctx.from.id;

    if (userId === ADMIN_ID) {
        return ctx.reply("👑 **مكتب المالك (Admin)**\nأهلاً يا هندسة، المنصة تحت سيطرتك.", 
            Markup.keyboard([
                ['إعدادات المنصة', 'حالة السيستم'],
                ['قائمة التجار']
            ]).resize()
        );
    }

    // فحص المشتركين
    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();

    if (merchant && merchant.status === 'active') {
        return ctx.reply(`🏪 أهلاً يا ${merchant.shop_name}`, 
            Markup.inlineKeyboard([
                [Markup.button.webApp('⚙️ غرفة العمليات', `${APP_URL}/merchant.html`)],
                [Markup.button.webApp('👁️ معاينة المتجر', `${APP_URL}/shop.html?id=${merchant.id}`)]
            ])
        );
    }

    return ctx.reply("🚀 مرحباً بك في Trustify.\nاضغط أدناه للاشتراك وفتح متجرك بـ 250 ج.م فقط:", 
        Markup.inlineKeyboard([
            [Markup.button.webApp('📝 سجل الآن كتاجر', `${APP_URL}/register.html`)]
        ])
    );
});

// الأوامر اللي بتفتح الواجهات للمالك (عشان الزرار يشتغل ويب)
bot.hears('إعدادات المنصة', (ctx) => {
    ctx.reply('فتح إعدادات المنصة:', Markup.inlineKeyboard([
        [Markup.button.webApp('🖥️ لوحة التحكم الإدارية', `${APP_URL}/admin.html`)]
    ]));
});

bot.hears('قائمة التجار', (ctx) => {
    ctx.reply('إدارة التجار المشتركين:', Markup.inlineKeyboard([
        [Markup.button.webApp('👥 عرض قائمة التجار', `${APP_URL}/admin.html#merchants`)]
    ]));
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
