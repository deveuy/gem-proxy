export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

    // Безопасное чтение тела запроса
    let bodyText = "";
    try {
      bodyText = await request.text();
    } catch (e) {
      bodyText = "{}";
    }

    // Пересылаем запрос в Google Gemini
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyText,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Если упадет, мы увидим КТO именно упал
    return new Response(JSON.stringify({ error: "Proxy Error: " + error.message }), { status: 500 });
  }
}