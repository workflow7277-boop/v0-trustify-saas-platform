const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const TOKEN = process.env.TELEGRAM_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

async function sendMessage(chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text, parse_mode: "HTML" };
  if (keyboard) body.reply_markup = keyboard;
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const user = msg.from;

  await supabase.from("users").upsert(
    { telegram_id: user.id, username: user.username, first_name: user.first_name },
    { onConflict: "telegram_id" }
  );

  if (text === "/start") {
    await sendMessage(chatId,
      `👋 أهلاً <b>${user.first_name}</b>!\n\nمرحباً في المتجر 🛒\nاختار من القائمة:`,
      {
        inline_keyboard: [
          [{ text: "🛍️ المنتجات", callback_data: "products" },
           { text: "🛒 سلة المشتريات", callback_data: "cart" }],
          [{ text: "📦 طلباتي", callback_data: "orders" },
           { text: "📞 تواصل معنا", callback_data: "contact" }],
        ],
      }
    );

  } else if (text === "قائمة التجار" || text === "/merchants") {
    const { data: merchants } = await supabase
      .from("merchants").select("name, description").limit(5);

    if (!merchants || merchants.length === 0)
      return sendMessage(chatId, "❌ لا يوجد تجار مسجلين حالياً");

    let reply = "🏪 <b>قائمة التجار:</b>\n\n";
    merchants.forEach((m, i) => {
      reply += `${i + 1}. <b>${m.name}</b>\n${m.description || ""}\n\n`;
    });
    await sendMessage(chatId, reply);

  } else {
    await sendMessage(chatId, `لم أفهم رسالتك 🤔\n\nاستخدم /start للقائمة الرئيسية`);
  }
}

async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const data = callback.data;

  await fetch(`${API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callback.id }),
  });

  if (data === "products") {
    const { data: products } = await supabase
      .from("products").select("name, price").limit(5);

    if (!products || products.length === 0)
      return sendMessage(chatId, "❌ لا توجد منتجات حالياً");

    let reply = "🛍️ <b>المنتجات المتاحة:</b>\n\n";
    products.forEach((p, i) => {
      reply += `${i + 1}. ${p.name} — <b>${p.price} جنيه</b>\n`;
    });
    await sendMessage(chatId, reply);

  } else if (data === "cart") {
    await sendMessage(chatId, "🛒 سلتك فارغة حالياً");

  } else if (data === "orders") {
    const { data: orders } = await supabase
      .from("orders").select("id, status, total")
      .eq("telegram_id", callback.from.id)
      .order("created_at", { ascending: false }).limit(5);

    if (!orders || orders.length === 0)
      return sendMessage(chatId, "📦 لا توجد طلبات سابقة");

    let reply = "📦 <b>طلباتك:</b>\n\n";
    orders.forEach((o) => {
      reply += `🔹 طلب #${o.id} — ${o.status} — ${o.total} جنيه\n`;
    });
    await sendMessage(chatId, reply);

  } else if (data === "contact") {
    await sendMessage(chatId, "📞 <b>تواصل معنا</b>\n\n💬 @TrustifySupport");
  }
}

// ─── الـ Handler الرئيسي ─────────────────────────────────────────────
module.exports = async (req, res) => {
  // GET request — للتأكد إن الـ endpoint شغال
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, status: "Webhook is alive ✅" });
  }

  try {
    const body = req.body;
    if (body.message) await handleMessage(body.message);
    else if (body.callback_query) await handleCallback(body.callback_query);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(200).json({ ok: true }); // دايماً 200 لتيليجرام
  }
};
