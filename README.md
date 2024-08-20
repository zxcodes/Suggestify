# Suggestify
- A self-hostable project that generates weekly movie recommendations and sends them via email using Cloudflare Workers.

## Requirements
- Bun (JS Runtime), A Cloudflare account, Google AI and Resend API keys.

## Services Used

- Cloudflare Workers, Google's Generative AI (Model: Gemini 1.5 Pro), Resend (to send emails), and Cloudflare KV (to store previous responses and improve the new ones).

## Setup & Config

1. Clone the repository: `git clone https://github.com/zxcodes/Suggestify.git`
2. Install dependencies: `bun install`

3. Create a `.dev.vars` file in the root and store your API secrets there. An `.env` file won't work here since workers don't run in a typical Node runtime.
  - `RESEND_API_KEY`: Your Resend API key
  - `API_KEY`: Your Google AI API key

4. Create a KV namespace called `SUGGESTIONS_STORE` using Wrangler or CF Dashboard.
5. Configure your `wrangler.toml` file with the necessary bindings and environment variables (Refer CF Docs).

## Development

- Start the dev server by running `bun dev` and hit the cron by `curl http://localhost:8787/__scheduled`


## Deployment

1. Authenticate with Cloudflare: `wrangler login`
2. Deploy the worker: `bun deploy`
3. To View logs from the deployed worker, do `bun logs`
4. The `.dev.vars` file is only for local dev. Use wrangler to upload your secrets to CF so that they're available when you deploy your worker. You can add secrets by running `wrangler secret put <KEY>`
 