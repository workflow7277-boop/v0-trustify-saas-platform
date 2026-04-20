module.exports = async function(req, res) {
  res.setHeader("Content-Type", "application/json");
  
  const TOKEN = process.env.TELEGRAM_TOKEN;

  if (req.method !== "POST") {
    return res.status(200).end(JSON.stringify({ 
      ok: true, 
      token_exists: !!TOKEN
    }));
  }

  try {
    let body = "";
    await new Promise((resolve) => {
      req.on("data", chunk => { body += chunk; });
      req.on("end", resolve);
    });

    const data = JSON.parse(body || "{}");
    const chatId = data.message && data.message.chat && data.message.chat.id;

    if (chatId) {
      await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "Hello! Bot is working!" })
      });
    }
  } catch(e) {
    cons
