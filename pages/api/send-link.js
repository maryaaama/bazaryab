export default async function handler(req, res) {
  // فقط اجازه POST میده
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Basic Auth برای درخواست از فرانت به ورسل
  const authHeader = req.headers.authorization;
  const serverAuth = 'Basic ' + Buffer.from('admin:admin').toString('base64'); // رمز و user بین فرانت و API ورسل
  if (!authHeader || authHeader !== serverAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const body = req.body;

    // آدرس وبهوک n8n باید از نوع /webhook باشه نه /webhook-test
    const webhookUrl = 'https://33328-ekmil.s2.irann8n.com/webhook/26d7f28c-00fa-4f2a-870f-8ae2a7a6e97f';

    // ارسال درخواست به وبهوک n8n همراه با Basic Auth خودش
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64') // credential خود وبهوک n8n
      },
      body: JSON.stringify(body)
    });

    // هندل کردن خروجی حتی اگر متن باشد
    let result;
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      result = await resp.json();
    } else {
      result = await resp.text();
    }

    res.status(resp.status).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
