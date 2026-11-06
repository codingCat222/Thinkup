# ThinkUp Happy December – Best Kids’ Apps Challenge Platform

A modern, high-performance event registration, payment checkout, and organiser management platform for **ThinkUp Innovation Services** for the **Happy December – Best Kids’ Apps Challenge** (Saturday, December 12, 2026 at ThinkUp Innovation Hub, Ibadan, Nigeria).

![Website Flyer Preview](/images/flyer.jpg)

---

## 🌟 Executive Overview of What Is Built

### 1. Public Event Landing Page & Brand Experience
- **Real Event Details**: Verified from the official flyer:
  - **Date**: Saturday, December 12, 2026
  - **Time**: 10:00 AM – 5:00 PM
  - **Venue**: ThinkUp Innovation Hub (2nd Floor, Purpose Mall, 23 Awolowo Avenue, Opposite GTCO/Cloud 7, Old Bodija, Ibadan, Nigeria)
  - **Contacts**: `0806 755 7709` | `0706 520 2865`
  - **Social Channels**: `@thinkupinnovationhub` (Instagram & TikTok)
- **4 Age Categories & Cash Prizes**:
  - 🎈 **Ages 2–5**: ₦10,000 Cash Prize (Playground & Bouncing Castle)
  - 🎬 **Ages 6–8**: ₦15,000 Cash Prize (Movies & Games)
  - 💡 **Ages 9–12**: ₦20,000 Cash Prize (Junior Category)
  - 💻 **Ages 13–19**: ₦25,000 Cash Prize (Senior Category)
- **Accessible & Responsive**:
  - Respects reduced-motion preferences (`@media (prefers-reduced-motion: reduce)`).
  - High contrast, WCAG compliant focus rings, semantic HTML structure.

---

### 2. Registration & Paystack Payment Architecture
- **Server-Side Pricing**: Entry fee (e.g. `₦5,000 NGN`) is strictly enforced from server configuration (`REGISTRATION_FEE_NGN` / `500,000 kobo`). The browser never dictates or passes the payment amount.
- **Pending Registration Lifecycle**: Submitting the form creates a pending record in SQLite with a unique reference code (`TUK-XXXX`) before payment initialization.
- **Paystack Readiness (Zero-Key Safe State)**:
  - When Paystack keys are not yet configured, the system provides an honest, clear **Payment Gateway Pending** status:
    - Informs the parent that the automated payment gateway is being finalized before Monday.
    - Displays their registration reference code.
    - Provides direct one-click WhatsApp assistance to confirm the spot offline if needed.
    - *Never* fakes or claims a real payment occurred.
  - When keys are added to environment variables (`PAYSTACK_SECRET_KEY` & `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`), Paystack inline/redirect checkout activates automatically without code changes.
  - Development mock simulation is strictly gated behind `ALLOW_DEV_MOCK_PAYMENT=true` in non-production environments only and clearly labeled.
- **Webhook Security & Idempotency**:
  - Webhook route: `/api/webhooks/paystack`
  - Validates Paystack's `x-paystack-signature` via HMAC-SHA512 with constant-time equality checks.
  - Handles retries idempotently (if a registration is already marked `paid`, subsequent events return `200 OK` without duplicating records or re-sending emails).
- **After Payment Experience**:
  - Interactive verified ticket screen (`/checkout/verify?reference=...`) displaying the child's confirmed spot, registration code, payment reference, event schedule, and printable receipt.

---

### 3. Confirmation Email Service
- Triggered automatically only after server-side payment verification.
- **Data Minimization**: Minimizes sensitive child details (omits birthdate and address; only features child's first name, age category, and reference codes).
- **Independent Tracking**: Email delivery is tracked separately from payment success in SQLite (`email_logs` table and `email_status: 'pending' | 'sent' | 'failed' | 'not_configured'`).
- Allows organizers to safely resend confirmation emails from the Admin Portal without altering payment status.

---

### 4. Protected Organiser Admin Portal (`/admin`)
- Accessible at `/admin` with login at `/admin/login`.
- **Security**:
  - Server-authenticated on every route and API endpoint via secure, `httpOnly`, `sameSite: 'lax'` session cookies.
  - Password hashing via Node.js native `crypto.scryptSync` with cryptographic salts and constant-time verification.
- **Capabilities**:
  - Summary metrics: Total Registrations, Verified Paid, Pending Payments, Failed Payments, and Total Revenue (₦).
  - Distinct Visitor Analytics: Tracks unique website visitors separately from participant counts.
  - Searchable & Filterable Table: Filter by payment status, age category, or email delivery status; search by participant name, parent name, email, phone, ticket code, or payment reference.
  - Detail Inspection Drawer: Review complete submission details, app pitch description, uploaded attachments, and payment transaction logs.
  - One-Click Resend Email action for verified paid participants.

---

## 🛠️ Configuration & Setup Instructions

### Step 1: Initial Admin Account Setup
To create the first administrator account, run:
```bash
npm run seed:admin
```
Or customize with arguments:
```bash
node scripts/seed-admin.mjs [username] [email] [password] [fullName]
```
*Default Seeded Account:*
- **Username**: `admin`
- **Password**: `ThinkUpAdmin2026!`
- **Login URL**: [http://localhost:3005/admin/login](http://localhost:3005/admin/login)

---

### Step 2: Activating Paystack (When Keys Arrive)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update the keys with your credentials from the [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):
```env
# Server secret key (Never expose to client)
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
# or for staging:
# PAYSTACK_SECRET_KEY=your_paystack_test_secret_key_here

# Client public key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
# or for staging:
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_test_public_key_here

# Optional dedicated webhook secret (falls back to secret key if omitted)
PAYSTACK_WEBHOOK_SECRET=

# Set to false in production
ALLOW_DEV_MOCK_PAYMENT=false
```

#### Configuring the Paystack Webhook URL:
1. In the Paystack Dashboard, navigate to **Settings** -> **API Keys & Webhooks**.
2. Under **Live Webhook URL** (or Test Webhook URL), enter:
   ```text
   https://yourdomain.com/api/webhooks/paystack
   ```
3. Save changes. Paystack will now deliver signed webhook events directly to your server.

---

### Step 3: Activating Confirmation Emails
In `.env.local`, choose your provider:

**Option A: Resend (Recommended)**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="ThinkUp Innovation Hub <events@thinkupinnovations.com>"
```

**Option B: Custom SMTP**
```env
SMTP_HOST=smtp.yourmailserver.com
SMTP_PORT=587
SMTP_USER=events@thinkupinnovations.com
SMTP_PASS=your_smtp_password
EMAIL_FROM="ThinkUp Innovation Hub <events@thinkupinnovations.com>"
```

---

## 🧪 Automated Test Suite

Run the comprehensive platform test suite:
```bash
npm test
```

### Covered Test Specifications:
1. **Form Validation**: Rejects invalid phone numbers and missing fields; validates conforming inputs.
2. **Checkout Initialization & Server Pricing**: Enforces server-side fee (`₦5,000 NGN`), generates pending records, and assigns unique references.
3. **Payment Verification & Idempotency**: Confirms status transitions to `paid` and prevents duplicate verifications from overwriting timestamps.
4. **Webhook Security**: Rejects forged or missing HMAC-SHA512 signatures; verifies valid signatures.
5. **Email Delivery & Safe Retry**: Confirms email states transition safely without impacting payment status or re-charging participants.
6. **Admin Authorization**: Rejects unauthenticated requests; validates authenticated sessions; verifies revenue aggregation and visitor separation.

---

## 🚀 Running the Server Locally

```bash
# Build production bundle
npm run build

# Start production server on port 3005
PORT=3005 npm run start
```
- **Public Portal**: [http://localhost:3005](http://localhost:3005)
- **Admin Dashboard**: [http://localhost:3005/admin](http://localhost:3005/admin)
- **Admin Login**: [http://localhost:3005/admin/login](http://localhost:3005/admin/login)

---

## 📁 Repository Structure

```text
├── app/
│   ├── admin/
│   │   ├── login/page.tsx       # Secure admin authentication screen
│   │   └── page.tsx             # Organiser management dashboard & metrics
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts   # Admin login & session issuance
│   │   │   ├── logout/route.ts  # Session revocation
│   │   │   ├── metrics/route.ts # Analytics & revenue metrics
│   │   │   ├── registrations/route.ts # Searchable, paginated participant list
│   │   │   └── resend-email/route.ts  # Safe confirmation email retry
│   │   ├── payment/
│   │   │   ├── initialize/route.ts    # Server-side pricing & checkout init
│   │   │   └── verify/route.ts        # Processor verification & state update
│   │   ├── register/route.ts          # Form submission & draft persistence
│   │   └── webhooks/paystack/route.ts # HMAC-SHA512 webhook handler
│   ├── checkout/
│   │   └── verify/page.tsx      # Return ticket confirmation & receipt
│   ├── globals.css              # Custom styling, reduced-motion, focus rings
│   ├── layout.tsx               # Root layout & SEO Open Graph metadata
│   └── page.tsx                 # Full Landing Page
├── components/
│   ├── AboutChallenge.tsx       # Hackathon pitch opportunities & benefits
│   ├── AboutThinkUp.tsx         # 4 Pillars: Learn, Think, Innovate, Scale
│   ├── AgeCategories.tsx        # 4 interactive category cards with prizes
│   ├── Contact.tsx              # Click-to-call, WhatsApp & Social buttons
│   ├── EventDetails.tsx         # Date, Time, Venue & Embedded Google Map
│   ├── FAQ.tsx                  # Accordion FAQ for parents
│   ├── Footer.tsx               # Footer with links, terms & organiser login
│   ├── Hero.tsx                 # Hero section with headline, CTA & flyer
│   ├── HowItWorks.tsx           # 3-step participation flow
│   ├── Logo.tsx                 # ThinkUp Innovation Services official logo
│   └── RegistrationForm.tsx     # Full registration form with Paystack flow
├── data/
│   └── registrations.db         # Persistent SQLite database
├── lib/
│   ├── admin-auth.ts            # Server-side session verification helper
│   ├── config.ts                # Server configuration, pricing & env checks
│   ├── db.ts                    # SQLite schema, migrations & queries
│   ├── email.ts                 # Confirmation email delivery & template
│   ├── paystack.ts              # Paystack API, verification & webhook security
│   └── validations.ts           # Zod schema for input validation
├── scripts/
│   └── seed-admin.mjs           # CLI script to create organiser accounts
├── tests/
│   └── platform.test.mjs        # 13 automated platform & security tests
├── .env.example                 # Example configuration template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
