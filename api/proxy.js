export default async function handler(req, res) {
  // Replace this with the real external API URL
  const API_URL = "https://example.com/api/data";

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");

    return res.status(response.status).send(text);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to reach external API",
      details: error.message,
    });
  }
}
