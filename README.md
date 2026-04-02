# ImageCore.ai — minimal Signus.ai client scaffold

This small project demonstrates how to call the Signus.ai signature-generation API endpoint without embedding credentials in source.

Files created:
- ImageCore.ai/src/index.js — CLI runner
- ImageCore.ai/src/apiClient.js — small API client
- ImageCore.ai/.env.example — example env var

Security note: Do NOT paste or commit bearer tokens into source. If you found a leaked token, rotate/revoke it immediately.

Usage

1. Install (no dependencies required for Node 18+):

```bash
cd ImageCore.ai
node -v # >=18
```

2. Provide your token either as an environment variable or input at runtime.

Linux / macOS example:
```bash
export SIGNUS_API_TOKEN="your_token_here"
node src/index.js "A beautiful sunset over mountains"
```

Windows PowerShell example:
```powershell
$env:SIGNUS_API_TOKEN = "your_token_here"
node src/index.js "A beautiful sunset over mountains"
```

Or run without env var and paste token when prompted.

Output

- If the API returns JSON it will be saved to `output.json`.
- If the API returns binary image data it will be saved to `output.bin`.

If you want me to adapt this to save image files with proper extensions, or to add retries/timeout, tell me which format the API returns and I will update the client.

Similar-image generation

The client supports generating images similar to an existing image by passing the image id with the `--similar` (or `-s`) flag. Optionally you can provide a generation id with `--gen-id` (or `-g`) when the API requires it.

Examples:

```bash
# Regular generation
node src/index.js "A beautiful sunset over mountains"

# Generate similar to an existing image by id
node src/index.js --similar b472a24a-3323-4d52-a1d2-1128ba7f5311 "Make it more painterly"

# Provide a generation id if required by the API path
node src/index.js --gen-id 998aa937-30a6-4559-a7fb-a66859d6138e --similar b472a24a-3323-4d52-a1d2-1128ba7f5311 "Black and white"

# Save to a specific filename
node src/index.js -s b472a24a-3323-4d52-a1d2-1128ba7f5311 -o my_image.png "Make it high contrast"
```

Listing generated images (signatures)

If you have a valid API token, the service exposes a signatures listing for a generation. Do NOT use tokens you do not own or that were leaked — obtain/rotate a token via your account.

Example with `curl` (uses `GEN_ID` and `SIGNUS_API_TOKEN` from your account):

```bash
GEN_ID=998aa937-30a6-4559-a7fb-a66859d6138e
curl -H "Authorization: Bearer $SIGNUS_API_TOKEN" \
	"https://api.signus.ai/api/signus/v0/signature-generations/ai/$GEN_ID/signatures/"
```

Or call from Node (requires a valid `SIGNUS_API_TOKEN` in env):

```bash
node -e "(async()=>{const m=await import('./src/apiClient.js');console.log(await m.listSignatures(process.argv[1], process.env.SIGNUS_API_TOKEN));})()" <GEN_ID>
```

If you want, I can add a `--list-signatures` CLI flag to `src/index.js` that calls `listSignatures()` and writes the JSON to a file.
