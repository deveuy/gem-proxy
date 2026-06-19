export const config = {
  runtime: 'edge', // Используем сверхбыструю Edge-платформу
};

export default async function handler(request) {
  // Разрешаем запросы только методом POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    // Получаем URL, который нам прислал chat.php (с ключом в параметрах)
    const url = new URL(request.url);
    const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

    // Пересылаем тело запроса, которое сформировал наш PHP-скрипт
    const body = await request.text();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}