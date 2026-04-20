const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const TOKEN = process.env.TELEGRAM_TOKEN;
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
  await fetch(API + "/sendMessage", {
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
    {
      telegram_id: user.id,
      username: user.username || null,
      first_name: user.first_name || null,
    },
    { onConflict: "telegram_id" }
  );

  if (text === "/start") {
    const keyboard = {
      inline_keyboard: [
        [
          { text: "\u{1F6CD}\u{FE0F} Products", callback_data: "products" },
          { text: "\u{1F6D2} Cart", callback_data: "cart" },
        ],
        [
          { text: "\u{1F4E6} My Orders", callback_data: "orders" },
          { text: "\u{1F4DE} Contact", callback_data: "contact" },
        ],
      ],
    };
    await sendMessage(
      chatId,
      "Hello <b>" + user.first_name + "</b>!\n\nWelcome to the store. Choose from the menu:",
      keyboard
    );
  } else if (text === "/merchants") {
    const { data: merchants } = await supabase
      .from("merchants")
      .select("name, description")
      .limit(5);

    if (!merchants || merchants.length === 0) {
      return sendMessage(chatId, "No merchants found.");
    }

    let reply = "<b>Merchants:</b>\n\n";
    for (let i = 0; i < merchants.length; i++) {
      reply += (i + 1) + ". <b>" + merchants[i].name + "</b>\n";
      reply += (merchants[i].description || "") + "\n\n";
    }
    await sendMessage(chatId, reply);
  } else {
    await sendMessage(chatId, "Use /start to see the menu.");
  }
}

async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const data = callback.data;

  await fetch(API + "/answerCallbackQuery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callback.id }),
  });

  if (data === "products") {
    const { data: products } = await supabase
      .from("products")
      .select("name, price")
      .limit(5);

    if (!products || products.length === 0) {
      return sendMessage(chatId, "No products available.");
    }

    let reply = "<b>Available Products:</b>\n\n";
    for (let i = 0; i < products.length; i++) {
      reply += (i + 1) + ". " + products[i].name + " - <b>" + products[i].price + "</b>\n";
    }
    await sendMessage(chatId, reply);

  } else if (data === "cart") {
    await sendMessage(chatId, "Your cart is empty.");

  } else if (data === "orders") {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, status, total")
      .eq("telegram_id", callback.from.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!orders || orders.length === 0) {
      return sendMessage(chatId, "No orders found.");
    }

    let reply = "<b>Your Orders:</b>\n\n";
    for (let i = 0; i < orders.length; i++) {
      reply += "Order #" + orders[i].id + " - " + orders[i].status + " - " + orders[i].total + "\n";
    }
    await sendMessage(chatId, reply);

  } else if (data === "contact") {
    await sendMessage(chatId, "Contact us: @TrustifySupport");
  }
}

module.exports = async function(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, status: "Webhook alive" });
  }

  try {
    const body = req.body;
    if (body.message) {
      await handleMessage(body.message);
    } else if (body.callback_query) {
      await handleCallback(body.callback_query);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err.message);
    return res.status(200).json({ ok: true });
  }
};
