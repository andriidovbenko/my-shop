# My Shop — Next.js E-commerce Boilerplate

Universal e-commerce boilerplate built with Next.js App Router, Chakra UI, and Sanity.io. Works for any product type.

## Tech Stack

- **Next.js** (App Router, TypeScript, ISR)
- **Chakra UI v2** with custom semantic token theme
- **Sanity.io** — product catalog CMS + order storage
- **Nova Poshta** API integration for delivery
- **Telegram** bot notifications for new orders
- **Zod** for server + client validation

---

## Project Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd my-shop
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in each variable — see the guide below.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Set up Sanity Studio

Open [http://localhost:3000/studio](http://localhost:3000/studio) to manage products, categories, and orders.

---

## Environment Variables Guide

### Sanity (CMS)

1. Go to [sanity.io](https://www.sanity.io) and sign in.
2. Create a new project or open an existing one.
3. **Project ID** — found at [sanity.io/manage](https://sanity.io/manage) → select your project → the ID is shown under the project name.
4. **API Token** — go to your project → **API** tab → **Tokens** → **Add API token**. Choose **Editor** permissions. Copy the token immediately (shown only once).

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skABC...
```

### Telegram (order notifications)

1. Open Telegram and find **@BotFather**.
2. Send `/newbot` and follow the prompts to create a bot. Copy the **HTTP API token**.
3. **Get your Chat ID:**
   - Add the bot to the group or channel where you want notifications, or send it any message in a direct chat.
   - Open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in your browser.
   - Find `"chat":{"id":...}` in the response — that number is your `TELEGRAM_CHAT_ID`.
   - For groups the ID will be negative (e.g. `-1001234567890`).

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...
TELEGRAM_CHAT_ID=-1001234567890
```

### Nova Poshta (delivery)

1. Register or log in at [novaposhta.ua](https://novaposhta.ua).
2. Go to **Особистий кабінет** → **Налаштування** → **Безпека** → **API-ключ**.
3. Copy the key.

```env
NOVA_POSHTA_API_KEY=your_api_key_here
```

### Payment (IBAN)

1. Your IBAN is provided by your bank when you open a business (ФОП) account.
2. It can be found in your internet banking under account details, or on a bank statement.
3. Format: `UA` + 27 digits, e.g. `UA903052990000026007233566001`.

```env
NEXT_PUBLIC_IBAN=UA903052990000026007233566001
NEXT_PUBLIC_RECIPIENT_NAME=Іваненко Іван Іванович
```

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Select your GitHub repository and click **Import**.
4. Vercel auto-detects Next.js — no build configuration changes needed.

### 3. Add environment variables

In your Vercel project → **Settings** → **Environment Variables**, add all variables from `.env.example`. Set them for the **Production** environment.

### 4. Deploy

Click **Deploy**. Every `git push` to `main` triggers a new deployment automatically.

---

## Connect a Custom Domain

1. In your Vercel project → **Settings** → **Domains** → **Add**.
2. Enter your domain (e.g. `myshop.com`) and click **Add**.
3. Vercel shows you the required DNS records. Go to your domain registrar:
   - **Apex domain** (`myshop.com`): add an **A record** pointing to `76.76.21.21`.
   - **Subdomain** (`www.myshop.com`): add a **CNAME record** pointing to `cname.vercel-dns.com`.
4. DNS propagation takes a few minutes to 24 hours.
5. Vercel automatically provisions an SSL certificate.
6. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to match your new domain.

---

## Sanity Webhook (ISR Revalidation)

To auto-revalidate pages when content changes in Sanity:

1. [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Webhooks** → **Add webhook**.
2. URL: `https://yourdomain.com/api/revalidate`
3. Trigger on: **Create**, **Update**, **Delete**.
4. Save. Pages will revalidate within seconds of any CMS change.
