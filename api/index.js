const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// رابط الـ Web App بتاعك (الرابط اللي vercel هيديهولك)
const APP_URL = "https://your-vercel-app.vercel.app"; 
const ADMIN_ID = 5809716918;

bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // 1. واجهة المالك (مكتب محمد المخفي)
    if (userId === ADMIN_ID) {
        return ctx.reply("👑 أهلاً يا مستر محمد. مكتبك الإداري جاهز:", 
            Markup.inlineKeyboard([[Markup.button.webApp('🖥️ دخول لوحة الإدارة', `${APP_URL}/admin.html`)]])
        );
    }

    // 2. فحص هل هو مشترك أم زبون؟
    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();

    if (merchant) {
        if (merchant.status === 'active') {
            // واجهة المشترك (غرفة العمليات)
            return ctx.reply(`🏪 أهلاً يا ${merchant.shop_name}. غرفة عملياتك جاهزة:`, 
                Markup.inlineKeyboard([
                    [Markup.button.webApp('⚙️ إدارة المتجر والـ AI', `${APP_URL}/merchant.html`)],
                    [Markup.button.webApp('👁️ معاينة فاترينا الزبون', `${APP_URL}/shop.html?id=${merchant.id}`)]
                ])
            );
        } else {
            return ctx.reply("⏳ اشتراكك قيد المراجعة. سيتم إخطارك بمجرد تفعيل الموظفين الآليين.");
        }
    }

    // 3. واجهة الزوار (طلب الاشتراك بـ 250 جنيه)
    return ctx.reply("🚀 مرحباً بك في Trustify.\nابدأ مشروعك الآن بـ 250 جنيه فقط واحصل على موظفين AI لإدارة متجرك.", 
        Markup.inlineKeyboard([[Markup.button.webApp('📝 اشترك الآن وافتح متجرك', `${APP_URL}/register.html`)]])
    );
});

module.exports = async (req, res) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
