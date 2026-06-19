export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(request.url);
    
    // ЖЕСТКО УКАЗЫВАЕМ ПРАВИЛЬНЫЙ ЭНДПОИНТ GEMINI (Вместо url.pathname)
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent${url.search}`;

    let bodyText = "";
    try {
      bodyText = await request.text();
    } catch (e) {
      bodyText = "{}";
    }

    // Отправляем запрос в Google
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyText,
    });

    // Читаем сырой текст ответа от Google (чтобы не падать, если там не JSON)
    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { error: "Google returned non-JSON response: " + responseText };
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Proxy Error: " + error.message }), { status: 500 });
  }
}