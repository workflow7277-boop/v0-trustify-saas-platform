module.exports = async function(req, res) {
  const TOKEN = process.env.TELEGRAM_TOKEN;
  
  if (req.method !== "POST") {
    return res.status(200).json({ 
      ok: true, 
      token_exists: !!TOKEN,
      token_preview: TOKEN ? TOKEN.substring(0, 10) : "MISSING"
    });
  }

  const body = req.body;
  const chatId = body && body.message && body.message.chat.id;
  
  if (chatId) {
    await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Bot is working!"
      })
    });
  }

  return res.status(200).json({ ok: true });
};
