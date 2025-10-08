export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { link } = req.body;

    if (!link || typeof link !== "string") {
      return res.status(400).json({ error: "Invalid link" });
    }

    // Active Webhook n8n  //       https://33328-ekmil.s2.irann8n.com/webhook/1f23c25b-0b43-46f5-9e5a-a5c77ae00738
    const n8nWebhookUrl =
     "https://33328-ekmil.s2.irann8n.com/webhook-test/1f23c25b-0b43-46f5-9e5a-a5c77ae00738";


    const username = "admin"; // اگر Basic Auth داری
    const password = "admin";
    const basicAuthHeader =
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": basicAuthHeader, // اگر Basic Auth فعال نیست حذف کن
      },
      body: JSON.stringify({ link }),
    });

    const responseText = await n8nRes.text();

    if (!n8nRes.ok) {
      return res.status(n8nRes.status).send(responseText);
    }

    res.status(200).json({ success: true, message: responseText });
  } catch (error) {
    console.error("Error sending link to n8n:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
