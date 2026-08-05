export default async function handler(req, res) {
  const { endpoint, id, icon } = req.query;

  let url;

  switch (endpoint) {
    case "rots":
      url = "https://indieun.com/cab/rots";
      break;
    case "bag":
      url = "https://indieun.com/cab/bag";
      break;
    case "skins":
      url = "https://indieun.com/cab/skins";
      break;
    case "inventory":
      url = `https://indieun.com/cab/inventory/${id}`;
      break;
    case "icon":
      url = `https://indieun.com/cab/icons/${icon}.png`;
      break;
    default:
      return res.status(400).json({ error: "Invalid endpoint" });
  }

  const response = await fetch(url);
  const body = await response.arrayBuffer();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Content-Type",
    response.headers.get("content-type") || "application/octet-stream"
  );

  res.status(response.status).send(Buffer.from(body));
}
