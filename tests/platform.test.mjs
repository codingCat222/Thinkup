import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

// Load app modules
const dbModule = await import('../lib/db.ts');
const {
  saveRegistration,
  getRegistrationByCode,
  setRegistrationPaymentReference,
  getRegistrationByPaymentReference,
  markRegistrationPaid,
  markRegistrationPaymentFailed,
  updateEmailStatus,
  createAdminUser,
  createAdminSession,
  validateAdminSession,
  revokeAdminSession,
  getAdminMetrics,
} = dbModule;

const paystackModule = await import('../lib/paystack.ts');
const {
  initializePaystackPayment,
  verifyPaystackTransaction,
  verifyPaystackWebhookSignature,
} = paystackModule;

const validationsModule = await import('../lib/validations.ts');
const { registrationSchema } = validationsModule;

describe('ThinkUp Event & Payment Platform Test Suite', () => {
  let testRegCode = '';
  let testPaymentRef = '';

  describe('1. Form Validation Tests', () => {
    test('rejects registration with invalid phone and missing fields', () => {
      const invalidData = {
        parentName: 'A',
        parentPhone: '12345',
        parentEmail: 'not-an-email',
        childName: '',
        dateOfBirth: '',
        age: 1, // too young
        schoolName: '',
        ageCategory: '',
        projectDescription: 'short',
        consentGiven: false,
        privacyAgreed: false,
      };

      const result = registrationSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      assert.ok(result.error.issues.length >= 6);
    });

    test('accepts valid registration payload', () => {
      const validData = {
        parentName: 'Mrs. Folake Adeleke',
        parentPhone: '08067557709',
        parentEmail: 'folake@example.com',
        childName: 'Tosin Adeleke',
        dateOfBirth: '2014-08-20',
        age: 12,
        schoolName: 'Bodija International School',
        ageCategory: 'Ages 9–12 (Junior Category)',
        projectDescription: 'An interactive quiz app that teaches kids Yoruba and French languages with audio recordings.',
        consentGiven: true,
        privacyAgreed: true,
      };

      const result = registrationSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });
  });

  describe('2. Checkout Initialization & Server Pricing Tests', () => {
    test('creates pending registration with server-enforced pricing in database', () => {
      const saved = saveRegistration({
        parentName: 'Dr. Kunle Balogun',
        parentPhone: '07065202865',
        parentEmail: 'kunle@example.com',
        childName: 'Seyi Balogun',
        dateOfBirth: '2012-03-15',
        age: 14,
        schoolName: 'Government College Ibadan',
        ageCategory: 'Ages 13–19 (Senior Category)',
        projectDescription: 'A solar-powered IoT weather station app for junior farmers in Oyo State.',
        consentGiven: true,
        privacyAgreed: true,
      });

      assert.ok(saved.registrationCode.startsWith('TUK-'));
      testRegCode = saved.registrationCode;

      const record = getRegistrationByCode(testRegCode);
      assert.ok(record);
      assert.strictEqual(record.paymentStatus, 'pending');
      assert.strictEqual(record.currency, 'NGN');
      assert.strictEqual(record.amountKobo, 500000); // Server enforced ₦5,000 = 500,000 kobo
    });

    test('associates unique payment reference with registration', () => {
      testPaymentRef = `TUK-MOCK-TEST-${Date.now()}`;
      const updated = setRegistrationPaymentReference(testRegCode, testPaymentRef, 500000);
      assert.strictEqual(updated, true);

      const record = getRegistrationByPaymentReference(testPaymentRef);
      assert.ok(record);
      assert.strictEqual(record.registrationCode, testRegCode);
      assert.strictEqual(record.paymentReference, testPaymentRef);
      assert.strictEqual(record.paymentStatus, 'pending');
    });
  });

  describe('3. Payment Verification & Idempotency Tests', () => {
    test('verifies payment and updates status to paid', () => {
      const marked = markRegistrationPaid({
        paymentReference: testPaymentRef,
        channel: 'card',
        transactionId: 'txn_test_12345',
      });

      assert.ok(marked);
      assert.strictEqual(marked.paymentStatus, 'paid');
      assert.ok(marked.paidAt);
      assert.strictEqual(marked.paymentChannel, 'card');
      assert.strictEqual(marked.paystackTransactionId, 'txn_test_12345');
    });

    test('idempotency: subsequent duplicate verification does not modify paidAt timestamp', () => {
      const first = getRegistrationByPaymentReference(testPaymentRef);
      const originalPaidAt = first?.paidAt;

      // Duplicate verify call
      const duplicate = markRegistrationPaid({
        paymentReference: testPaymentRef,
        channel: 'bank_transfer',
        transactionId: 'duplicate_attempt',
      });

      assert.ok(duplicate);
      assert.strictEqual(duplicate.paymentStatus, 'paid');
      assert.strictEqual(duplicate.paidAt, originalPaidAt); // Unchanged!
    });
  });

  describe('4. Paystack Webhook HMAC-SHA512 Signature Security Tests', () => {
    const testSecret = 'sk_test_demo_secret_key_12345';
    const payload = JSON.stringify({
      event: 'charge.success',
      data: {
        reference: testPaymentRef,
        amount: 500000,
        currency: 'NGN',
        status: 'success',
      },
    });

    test('rejects webhook payload with invalid signature', () => {
      const invalidSignature = 'bad_forged_signature_00000000000000000000000000000000';
      const isValid = verifyPaystackWebhookSignature(payload, invalidSignature);
      assert.strictEqual(isValid, false);
    });

    test('accepts webhook payload with valid computed signature', () => {
      process.env.PAYSTACK_SECRET_KEY = testSecret;
      const validSignature = crypto
        .createHmac('sha512', testSecret)
        .update(payload)
        .digest('hex');

      const isValid = verifyPaystackWebhookSignature(payload, validSignature);
      assert.strictEqual(isValid, true);
    });
  });

  describe('5. Email Tracking & Safe Retry Tests', () => {
    test('updates email status to sent without altering payment record', () => {
      const record = getRegistrationByPaymentReference(testPaymentRef);
      assert.ok(record);

      updateEmailStatus(record.id, 'sent');

      const fresh = getRegistrationByCode(testRegCode);
      assert.strictEqual(fresh?.emailStatus, 'sent');
      assert.strictEqual(fresh?.paymentStatus, 'paid'); // payment remains safely paid
    });

    test('records email delivery failure and permits retry', () => {
      const record = getRegistrationByPaymentReference(testPaymentRef);
      assert.ok(record);

      updateEmailStatus(record.id, 'failed', 'SMTP timeout error');
      const freshFailed = getRegistrationByCode(testRegCode);
      assert.strictEqual(freshFailed?.emailStatus, 'failed');
      assert.strictEqual(freshFailed?.emailError, 'SMTP timeout error');

      // Retry
      updateEmailStatus(record.id, 'sent');
      const freshRetried = getRegistrationByCode(testRegCode);
      assert.strictEqual(freshRetried?.emailStatus, 'sent');
    });
  });

  describe('6. Admin Security & Authorization Tests', () => {
    test('rejects invalid admin session token', () => {
      const result = validateAdminSession('completely_invalid_session_token_xyz');
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.user, undefined);
    });

    test('validates authentic admin session and revokes on logout', () => {
      // Create test admin
      const testAdminUser = `test_admin_${Date.now()}`;
      const admin = createAdminUser({
        username: testAdminUser,
        email: `${testAdminUser}@thinkup.ng`,
        passwordPlainText: 'SuperSecret123!',
        fullName: 'Test Auditor',
        role: 'organizer',
      });

      assert.ok(admin.id);

      const sessionToken = createAdminSession(admin.id, 1);
      assert.ok(sessionToken);

      const validation = validateAdminSession(sessionToken);
      assert.strictEqual(validation.isValid, true);
      assert.strictEqual(validation.user?.username, testAdminUser);

      // Revoke session
      revokeAdminSession(sessionToken);
      const afterRevoke = validateAdminSession(sessionToken);
      assert.strictEqual(afterRevoke.isValid, false);
    });

    test('admin metrics correctly counts revenue and separates visitors from participants', () => {
      const metrics = getAdminMetrics();
      assert.ok(metrics.totalRegistrations >= 1);
      assert.ok(metrics.paidRegistrations >= 1);
      assert.ok(metrics.totalRevenueNgn >= 5000);
      assert.strictEqual(typeof metrics.totalVisitors, 'number');
    });
  });
});

