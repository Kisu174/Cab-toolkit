const ALLOWED_ENDPOINTS = {
  rots: 'https://indieun.com/cab/rots',
  bag: 'https://indieun.com/cab/bag',
  skins: 'https://indieun.com/cab/skins',
};

export default async function handler(req, res) {
  // Allow the browser to call this Vercel Function.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, id, file } = req.query;
  let targetUrl;

  if (ALLOWED_ENDPOINTS[endpoint]) {
    targetUrl = ALLOWED_ENDPOINTS[endpoint];
  } else if (endpoint === 'inventory') {
    if (!/^\d+$/.test(String(id || ''))) {
      return res.status(400).json({ error: 'Invalid Roblox user ID' });
    }
    targetUrl = `https://indieun.com/cab/inventory/${encodeURIComponent(id)}`;
  } else if (endpoint === 'icon') {
    // Only allow simple image filenames such as 6.png or 73.png.
    if (!/^[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp|gif)$/i.test(String(file || ''))) {
      return res.status(400).json({ error: 'Invalid icon filename' });
    }
    targetUrl = `https://indieun.com/cab/icons/${encodeURIComponent(file)}`;
  } else {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        Accept: endpoint === 'icon' ? 'image/*' : 'application/json',
        'User-Agent': 'Catch-a-Brainrot-Toolkit/1.0',
      },
    });

    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    const body = Buffer.from(await upstream.arrayBuffer());
    return res.status(upstream.status).send(body);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to reach Indieun API',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
