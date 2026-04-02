import { generateImage } from '../src/apiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, generationId, similarImageId } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const token = process.env.SIGNUS_API_TOKEN;
  if (!token) return res.status(500).json({ error: 'Server missing SIGNUS_API_TOKEN environment variable' });

  try {
    const result = await generateImage(prompt, token, { generationId, similarImageId });

    if (result.type === 'json') {
      res.setHeader('content-type', 'application/json');
      return res.status(200).json(result.data);
    }

    // Binary image response
    const buf = result.data;
    res.setHeader('content-type', result.contentType || 'application/octet-stream');
    res.setHeader('cache-control', 'no-store');
    return res.status(200).send(buf);
  } catch (err) {
    console.error('generate API error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
