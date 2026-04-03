export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, phone, email, product, price } = req.body || {};

    if (!name || !phone || !email) {
      return res.status(400).json({
        ok: false,
        message: 'Заповніть усі поля'
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        ok: false,
        message: 'Не задані TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID'
      });
    }

    const text = [
      '🛒 НОВЕ ЗАМОВЛЕННЯ',
      '',
      `👤 Імʼя: ${name}`,
      `📞 Телефон: ${phone}`,
      `📧 Email: ${email}`,
      product ? `📦 Товар: ${product}` : null,
      price ? `💰 Ціна: ${price}` : null
    ]
      .filter(Boolean)
      .join('\\n');

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const tgData = await tgResponse.json();

    if (!tgResponse.ok || tgData.ok === false) {
      return res.status(500).json({
        ok: false,
        message: tgData.description || 'Помилка Telegram API'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Заявка відправлена'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || 'Internal server error'
    });
  }
}