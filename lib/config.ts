export interface ServerConfig {
  feeNgn: number;
  feeKobo: number;
  currency: string;
  paystackSecretKey: string | null;
  paystackPublicKey: string | null;
  paystackWebhookSecret: string | null;
  isPaystackConfigured: boolean;
  isPaystackTestMode: boolean;
  allowDevMockPayment: boolean;
  appUrl: string;
  emailConfig: {
    isConfigured: boolean;
    provider: 'smtp' | 'resend' | 'none';
    from: string;
  };
}

export function getServerConfig(): ServerConfig {
  const feeEnv = process.env.REGISTRATION_FEE_NGN;
  // Fallback to 5,000 NGN if not explicitly provided in environment
  const feeNgn = feeEnv ? parseInt(feeEnv, 10) : 5000;
  const feeKobo = feeNgn * 100;

  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || null;
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || null;
  const paystackWebhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || paystackSecretKey;

  const isPaystackConfigured = Boolean(
    paystackSecretKey && paystackSecretKey.startsWith('sk_')
  );

  const isPaystackTestMode = Boolean(
    paystackSecretKey && paystackSecretKey.startsWith('sk_test_')
  );

  // Development mock is strictly isolated to non-production environments
  const isDev = process.env.NODE_ENV !== 'production';
  const allowDevMockPayment = isDev && process.env.ALLOW_DEV_MOCK_PAYMENT === 'true';

  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3005';

  let emailProvider: 'smtp' | 'resend' | 'none' = 'none';
  if (process.env.RESEND_API_KEY) {
    emailProvider = 'resend';
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    emailProvider = 'smtp';
  }

  const emailFrom =
    process.env.EMAIL_FROM ||
    'ThinkUp Innovation Hub <events@thinkupinnovations.com>';

  return {
    feeNgn,
    feeKobo,
    currency: 'NGN',
    paystackSecretKey,
    paystackPublicKey,
    paystackWebhookSecret,
    isPaystackConfigured,
    isPaystackTestMode,
    allowDevMockPayment,
    appUrl,
    emailConfig: {
      isConfigured: emailProvider !== 'none',
      provider: emailProvider,
      from: emailFrom,
    },
  };
}

