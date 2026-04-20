const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

// رابط المشروع الجديد بتاعك
const APP_URL = "https://v0-trustify-saas-platform-git-main-workflow7277-boops-projects.vercel.app"; 
const ADMIN_ID = 5809716918;

bot.start(async (ctx) => {
    const userId = ctx.from.id;

    // 1. واجهة المالك (مكتب محمد المخفي)
    if (userId === ADMIN_ID) {
        return ctx.reply("👑 أهلاً يا مستر محمد. مكتبك الإداري جاهز لتطوير Trustify:", 
            Markup.inlineKeyboard([
                [Markup.button.webApp('🖥️ دخول لوحة الإدارة', `${APP_URL}/admin.html`)]
            ])
        );
    }

    // 2. فحص حالة المستخدم (مشترك أم زائر)
    const { data: merchant } = await supabase.from('subscribers').select('*').eq('telegram_id', userId).single();

    if (merchant) {
        if (merchant.status === 'active') {
            // واجهة المشترك (غرفة عمليات التاجر)
            return ctx.reply(`🏪 أهلاً يا ${merchant.shop_name}. غرفة عملياتك جاهزة:`, 
                Markup.inlineKeyboard([
                    [Markup.button.webApp('⚙️ إدارة المتجر والـ AI', `${APP_URL}/merchant.html`)],
                    [Markup.button.webApp('👁️ معاينة فاترينا الزبون', `${APP_URL}/shop.html?id=${merchant.id}`)]
                ])
            );
        } else {
            return ctx.reply("⏳ اشتراكك قيد المراجعة حالياً.\nبمجرد التأكد من الدفع (250 ج.م)، سيتم تفعيل الموظفين الآليين لمتجرك.");
        }
    }

    // 3. واجهة الزوار (الناس اللي لسه مشتركتش)
    return ctx.reply("🚀 مرحباً بك في Trustify.\nافتح متجرك الآن واحصل على موظفين AI لإدارة مبيعاتك بـ 250 جنيه فقط.", 
        Markup.inlineKeyboard([
            [Markup.button.webApp('📝 اشترك الآن وافتح متجرك', `${APP_URL}/register.html`)]
        ])
    );
});

// مخرج الـ API لإرسال المنتجات لصفحة الويب (عشان الفاترينا تشتغل)
module.exports = async (req, res) => {
    if (req.method === 'GET' && req.url.includes('/api/products')) {
        const { data: products } = await supabase.from('products').select('*');
        return res.status(200).json(products);
    }
    
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};
