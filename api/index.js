module.exports = async function(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, status: "Webhook alive" });
  }

  try {
    let body = req.body;

    // لو body جاي string ومش object
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    // لو body لسه undefined
    if (!body) {
      return res.status(200).json({ ok: true });
    }

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
