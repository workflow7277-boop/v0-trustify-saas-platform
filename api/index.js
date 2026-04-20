const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const TOKEN = process.env.TELEGRAM_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

// إرسال رسالة
async function sendMessage(chatId, text, keyboard = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (keyboard) body.reply_markup = keyboard;

  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// معالجة الرسائل
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const user = msg.from;

  // تسجيل المستخدم
  await supabase.from("users").upsert(
    { telegram_id: user.id, username: user.username, first_name: user.first_name },
    { onConflict: "telegram_id" }
  );

  // ─── الأوامر ───────────────────────────────────────────
  if (text === "/start") {
    const keyboard = {
      inline_keyboard: [
        [{ text: "🛍️ المنتجات", callback_data: "products" },
         { text: "🛒 سلة
