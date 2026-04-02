const API_URL = "https://api.signus.ai/api/signus/v0/users/me/signature-generations/ai";

export async function generateImage(prompt, token, options = {}) {
  // options: { generationId, similarImageId }
  if (!token) throw new Error("Missing API token");

  let url = API_URL;
  const { generationId, similarImageId } = options;
  if (generationId && similarImageId) {
    url = `${API_URL}/${encodeURIComponent(generationId)}/similar/${encodeURIComponent(similarImageId)}`;
  } else if (similarImageId) {
    url = `${API_URL}/similar/${encodeURIComponent(similarImageId)}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, image/*",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return { type: "json", data: await res.json(), contentType };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return { type: "binary", data: buffer, contentType };
}

export async function listSignatures(generationId, token) {
  if (!token) throw new Error("Missing API token");
  if (!generationId) throw new Error("Missing generationId");

  const url = `https://api.signus.ai/api/signus/v0/signature-generations/ai/${encodeURIComponent(
    generationId
  )}/signatures/`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return await res.json();
}
