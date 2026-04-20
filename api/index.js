const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// إعدادات قاعدة البيانات والبوت من الـ Environment Variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// الرابط الأساسي لمشروعك (تأكد إنه بدون / في الآخر)
const APP_URL = "https://v0-trustify-saas-platform-git-main-workflow7277-boops-projects.vercel.app"; 
const ADMIN_ID = 5809716918;

// أمر البداية /start
bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // 1. لو أنت المالك (محمد)
    if (userId === ADMIN_ID) {
        return ctx.reply("👑 **مكتب المالك (Admin)**\nأهلاً يا هندسة، المنصة تحت سيطرتك.", 
            Markup.keyboard([
                ['إعدادات المنصة', 'حالة السيستم'],
                ['قائمة التجار']
            ]).resize()
        );
    }

    // 2. فحص هل المستخدم تاجر (مشترك) أم لا
    try {
        const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();

        if (merchant && merchant.status === 'active') {
            return ctx.reply(`🏪 أهلاً يا ${merchant.shop_name}\nإليك أدوات إدارة متجرك:`, 
                Markup.inlineKeyboard([
                    [Markup.button.webApp('⚙️ غرفة العمليات', `${APP_URL}/merchant.html`)],
                    [Markup.button.webApp('👁️ معاينة المتجر', `${APP_URL}/shop.html?id=${merchant.id}`)]
                ])
            );
        }
    } catch (err) {
        console.log("New User or Error:", err.message);
    }

    // 3. لو زائر جديد (واجهة الزوار)
    return ctx.reply("🚀 مرحباً بك في Trustify.\nابدأ مشروعك الآن واحصل على موظفين AI لإدارة مبيعاتك بـ 250 ج.م فقط.", 
        Markup.inlineKeyboard([
            [Markup.button.webApp('📝 سجل الآن كتاجر', `${APP_URL}/register.html`)]
        ])
    );
});

// التعامل مع أزرار لوحة التحكم للمالك
bot.hears('إعدادات المنصة', (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        ctx.reply('فتح إعدادات المنصة:', Markup.inlineKeyboard([
            [Markup.button.webApp('🖥️ لوحة التحكم الإدارية', `${APP_URL}/admin.html`)]
        ]));
    }
});

bot.hears('حالة السيستم', async (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
        const { count: tjar } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });
        const { count: prods } = await supabase.from('products').select('*', { count: 'exact', head: true });
