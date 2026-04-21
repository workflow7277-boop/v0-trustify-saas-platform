const { createClient } = require("@supabase/supabase-js");

// هنا الكود هيشوف لو لقى الاسم القديم أو الجديد هيشتغل في الحالتين
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
);

const TOKEN = process.env.TELEGRAM_TOKEN || process.env.BOT_TOKEN;
const API = "https://api.telegram.org/bot" + TOKEN;

async function sendMessage(chatId, text, keyboard) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
  };
  if (keyboard) {
    body.reply_markup = keyboard;
  }
  try {
    await fetch(API + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const user = msg.from;

  // تسجيل المستخدم في سوبابيز
  try {
    await supabase.from("users").upsert(
      {
        telegram_id: user.id,
        username: user.username || null,
        first_name: user.first_name || null,
      },
      { onConflict: "telegram_id" }
    );
  } catch (e) {
    console.error("Supabase Error:", e.message);
  }

  if (text === "/start") {
    const keyboard = {
      inline_keyboard: [
        [
          { text: "Products 🛍️", callback_data: "products" },
          { text: "Cart 🛒", callback_data: "cart" },
        ],
        [
          { text: "My Orders 📦", callback_data: "orders" },
          { text: "Contact 📞", callback_data: "contact" },
        ],
      ],
    };
    await sendMessage(
      chatId,
      "أهلاً يا <b>" + user.first_name + "</b>! منور Trustify Store 🛒",
      keyboard
    );
  } else {
    await sendMessage(chatId, "استخدم أمر /start عشان تشوف القائمة.");
  }
}

// الـ Handler الرئيسي اللي فيرسيل بيفهمه
module.exports = async function(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook is active!");
  }

  try {
    const body = req.body;
    if (body.message) {
      await handleMessage(body.message);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: true });
  }
};
