import crypto from 'node:crypto';
import { getServerConfig } from './config.ts';

export interface PaystackInitResult {
  success: boolean;
  isMock?: boolean;
  reference?: string;
  authorizationUrl?: string;
  accessCode?: string;
  error?: string;
  message?: string;
}

export interface PaystackVerifyResult {
  success: boolean;
  isMock?: boolean;
  reference: string;
  amountKobo: number;
  currency: string;
  channel?: string;
  transactionId?: string;
  paidAt?: string;
  error?: string;
}

export async function initializePaystackPayment(params: {
  email: string;
  registrationCode: string;
  childName: string;
  category: string;
  callbackUrl?: string;
}): Promise<PaystackInitResult> {
  const config = getServerConfig();

  // If Paystack is not configured:
  if (!config.isPaystackConfigured) {
    // If dev mock is explicitly allowed in non-production:
    if (config.allowDevMockPayment) {
      const mockRef = `TUK-MOCK-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      return {
        success: true,
        isMock: true,
        reference: mockRef,
        authorizationUrl: `/checkout/verify?reference=${mockRef}&mock=true`,
      };
    }

    // Payment unavailable state when keys are pending
    return {
      success: false,
      error: 'PAYSTACK_NOT_CONFIGURED',
      message:
        'The online payment gateway is currently being finalized before event launch. Your registration draft has been securely recorded. Please contact the organizers or try again shortly.',
    };
  }

  // Generate trusted payment reference
  const reference = `TUK-PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const callbackUrl =
    params.callbackUrl || `${config.appUrl}/checkout/verify?reference=${reference}`;

  try {
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: config.feeKobo, // Strictly server-side configured
        currency: config.currency,
        reference,
        callback_url: callbackUrl,
        metadata: {
          registrationCode: params.registrationCode,
          childName: params.childName,
          category: params.category,
          source: 'thinkup-kids-challenge-portal',
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      return {
        success: false,
        error: 'PAYSTACK_API_ERROR',
        message: data.message || 'Paystack initialization failed. Please try again.',
      };
    }

    return {
      success: true,
      isMock: false,
      reference,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
    };
  } catch (err: any) {
    console.error('Paystack initialization exception:', err);
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to communicate with payment processor. Please check your network.',
    };
  }
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResult> {
  const config = getServerConfig();

  // Handle Dev Mock verification strictly in non-production with flag
  if (reference.startsWith('TUK-MOCK-')) {
    if (!config.allowDevMockPayment) {
      return {
        success: false,
        reference,
        amountKobo: 0,
        currency: 'NGN',
        error: 'Mock payments are disabled or disallowed in this environment.',
      };
    }

    return {
      success: true,
      isMock: true,
      reference,
      amountKobo: config.feeKobo,
      currency: config.currency,
      channel: 'dev_mock',
      transactionId: `mock_txn_${Date.now()}`,
      paidAt: new Date().toISOString(),
    };
  }

  if (!config.isPaystackConfigured) {
    return {
      success: false,
      reference,
      amountKobo: 0,
      currency: 'NGN',
      error: 'Paystack is not configured on this server.',
    };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.status || !data.data) {
      return {
        success: false,
        reference,
        amountKobo: 0,
        currency: 'NGN',
        error: data.message || 'Transaction verification failed with processor.',
      };
    }

    const txn = data.data;

    // Strict validation of amount, currency, and status
    if (txn.status !== 'success') {
      return {
        success: false,
        reference,
        amountKobo: txn.amount || 0,
        currency: txn.currency || 'NGN',
        error: `Transaction status is "${txn.status}" (expected "success").`,
      };
    }

    if (Number(txn.amount) !== config.feeKobo) {
      return {
        success: false,
        reference,
        amountKobo: txn.amount,
        currency: txn.currency,
        error: `Transaction amount mismatch: expected ${config.feeKobo} kobo, received ${txn.amount} kobo.`,
      };
    }

    if (txn.currency !== config.currency) {
      return {
        success: false,
        reference,
        amountKobo: txn.amount,
        currency: txn.currency,
        error: `Transaction currency mismatch: expected ${config.currency}, received ${txn.currency}.`,
      };
    }

    return {
      success: true,
      isMock: false,
      reference,
      amountKobo: txn.amount,
      currency: txn.currency,
      channel: txn.channel,
      transactionId: String(txn.id),
      paidAt: txn.paid_at || new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Paystack verify exception:', err);
    return {
      success: false,
      reference,
      amountKobo: 0,
      currency: 'NGN',
      error: 'Exception occurred while contacting Paystack verification API.',
    };
  }
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const config = getServerConfig();
  const secret = config.paystackWebhookSecret || config.paystackSecretKey;

  if (!secret || !signatureHeader) {
    return false;
  }

  try {
    const computedHmac = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(computedHmac, 'hex');
    const headerBuf = Buffer.from(signatureHeader, 'hex');

    if (expectedBuf.length !== headerBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, headerBuf);
  } catch (err) {
    console.error('Webhook signature comparison error:', err);
    return false;
  }
}
