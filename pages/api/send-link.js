export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Basic Auth
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Basic ' + Buffer.from('admin:admin').toString('base64')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const body = req.body;
   const webhookUrl = 'https://33328-ekmil.s2.irann8n.com/webhook/26d7f28c-00fa-4f2a-870f-8ae2a7a6e97f';

    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await resp.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
