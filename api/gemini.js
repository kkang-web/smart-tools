export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });

  const { base64Data, mimeType, prompt } = req.body;
  if (!base64Data || !mimeType || !prompt) return res.status(400).json({ error: '필수 파라미터 누락' });

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]}],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
      })
    }
  );

  const data = await geminiRes.json();
  res.status(geminiRes.status).json(data);
}
