import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { getServerConfig } from './config.ts';

const dbPath = path.join(process.cwd(), 'data', 'registrations.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new DatabaseSync(dbPath);

// Create base tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_code TEXT UNIQUE NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    child_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    age INTEGER NOT NULL,
    school_name TEXT NOT NULL,
    age_category TEXT NOT NULL,
    project_description TEXT NOT NULL,
    project_file_name TEXT,
    consent_given INTEGER NOT NULL,
    privacy_agreed INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payment_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER,
    payment_reference TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'organizer',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT UNIQUE NOT NULL,
    admin_user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Safe incremental migration: add missing columns to registrations table
const existingColumns = db.prepare(`PRAGMA table_info(registrations)`).all() as Array<{ name: string }>;
const columnNames = new Set(existingColumns.map((c) => c.name));

const requiredColumns: Record<string, string> = {
  payment_status: "TEXT NOT NULL DEFAULT 'pending'",
  payment_reference: 'TEXT',
  amount_kobo: 'INTEGER NOT NULL DEFAULT 0',
  currency: "TEXT NOT NULL DEFAULT 'NGN'",
  paid_at: 'TEXT',
  payment_channel: 'TEXT',
  paystack_transaction_id: 'TEXT',
  email_status: "TEXT NOT NULL DEFAULT 'pending'",
  email_sent_at: 'TEXT',
  email_error: 'TEXT',
};

for (const [col, colType] of Object.entries(requiredColumns)) {
  if (!columnNames.has(col)) {
    try {
      db.exec(`ALTER TABLE registrations ADD COLUMN ${col} ${colType};`);
    } catch (err: any) {
      console.warn(`Column ${col} might already exist or error:`, err.message);
    }
  }
}

// Ensure indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(registration_code);
  CREATE INDEX IF NOT EXISTS idx_registrations_payref ON registrations(payment_reference);
  CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(payment_status);
  CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
`);

export interface RegistrationInput {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  childName: string;
  dateOfBirth: string;
  age: number;
  schoolName: string;
  ageCategory: string;
  projectDescription: string;
  projectFileName?: string | null;
  consentGiven: boolean;
  privacyAgreed: boolean;
}

export interface RegistrationRecord extends RegistrationInput {
  id: number;
  registrationCode: string;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'abandoned';
  paymentReference: string | null;
  amountKobo: number;
  currency: string;
  paidAt: string | null;
  paymentChannel: string | null;
  paystackTransactionId: string | null;
  emailStatus: 'pending' | 'sent' | 'failed' | 'not_configured';
  emailSentAt: string | null;
  emailError: string | null;
}

function mapRowToRecord(row: any): RegistrationRecord {
  return {
    id: row.id,
    registrationCode: row.registration_code,
    parentName: row.parent_name,
    parentPhone: row.parent_phone,
    parentEmail: row.parent_email,
    childName: row.child_name,
    dateOfBirth: row.date_of_birth,
    age: row.age,
    schoolName: row.school_name,
    ageCategory: row.age_category,
    projectDescription: row.project_description,
    projectFileName: row.project_file_name,
    consentGiven: Boolean(row.consent_given),
    privacyAgreed: Boolean(row.privacy_agreed),
    createdAt: row.created_at,
    paymentStatus: row.payment_status || 'pending',
    paymentReference: row.payment_reference || null,
    amountKobo: row.amount_kobo || 0,
    currency: row.currency || 'NGN',
    paidAt: row.paid_at || null,
    paymentChannel: row.payment_channel || null,
    paystackTransactionId: row.paystack_transaction_id || null,
    emailStatus: row.email_status || 'pending',
    emailSentAt: row.email_sent_at || null,
    emailError: row.email_error || null,
  };
}

export function saveRegistration(input: RegistrationInput): { registrationCode: string; id: number } {
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const registrationCode = `TUK-${randomSuffix}`;
  const createdAt = new Date().toISOString();
  const config = getServerConfig();

  const insert = db.prepare(`
    INSERT INTO registrations (
      registration_code,
      parent_name,
      parent_phone,
      parent_email,
      child_name,
      date_of_birth,
      age,
      school_name,
      age_category,
      project_description,
      project_file_name,
      consent_given,
      privacy_agreed,
      created_at,
      payment_status,
      amount_kobo,
      currency,
      email_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'NGN', 'pending')
  `);

  const result = insert.run(
    registrationCode,
    input.parentName.trim(),
    input.parentPhone.trim(),
    input.parentEmail.trim().toLowerCase(),
    input.childName.trim(),
    input.dateOfBirth,
    Number(input.age),
    input.schoolName.trim(),
    input.ageCategory,
    input.projectDescription.trim(),
    input.projectFileName || null,
    input.consentGiven ? 1 : 0,
    input.privacyAgreed ? 1 : 0,
    createdAt,
    config.feeKobo
  );

  return {
    registrationCode,
    id: Number(result.lastInsertRowid),
  };
}

export function setRegistrationPaymentReference(
  registrationCode: string,
  paymentReference: string,
  amountKobo: number
): boolean {
  const stmt = db.prepare(`
    UPDATE registrations 
    SET payment_reference = ?, amount_kobo = ?
    WHERE registration_code = ? AND payment_status != 'paid'
  `);
  const result = stmt.run(paymentReference, amountKobo, registrationCode);
  return result.changes > 0;
}

export function getRegistrationByCode(code: string): RegistrationRecord | null {
  const row = db.prepare(`SELECT * FROM registrations WHERE registration_code = ?`).get(code) as any;
  if (!row) return null;
  return mapRowToRecord(row);
}

export function getRegistrationByPaymentReference(ref: string): RegistrationRecord | null {
  const row = db.prepare(`SELECT * FROM registrations WHERE payment_reference = ?`).get(ref) as any;
  if (!row) return null;
  return mapRowToRecord(row);
}

export function markRegistrationPaid(params: {
  paymentReference: string;
  channel?: string;
  transactionId?: string;
}): RegistrationRecord | null {
  const existing = getRegistrationByPaymentReference(params.paymentReference);
  if (!existing) return null;

  // Idempotency: if already paid, do not re-update
  if (existing.paymentStatus === 'paid') {
    return existing;
  }

  const paidAt = new Date().toISOString();
  db.prepare(`
    UPDATE registrations 
    SET payment_status = 'paid',
        paid_at = ?,
        payment_channel = ?,
        paystack_transaction_id = ?
    WHERE payment_reference = ?
  `).run(
    paidAt,
    params.channel || 'paystack',
    params.transactionId || null,
    params.paymentReference
  );

  return getRegistrationByPaymentReference(params.paymentReference);
}

export function markRegistrationPaymentFailed(paymentReference: string, reason?: string): boolean {
  const result = db.prepare(`
    UPDATE registrations 
    SET payment_status = 'failed'
    WHERE payment_reference = ? AND payment_status != 'paid'
  `).run(paymentReference);
  return result.changes > 0;
}

export function updateEmailStatus(
  registrationId: number,
  status: 'sent' | 'failed' | 'not_configured',
  error?: string
): void {
  const sentAt = status === 'sent' ? new Date().toISOString() : null;
  db.prepare(`
    UPDATE registrations 
    SET email_status = ?,
        email_sent_at = COALESCE(?, email_sent_at),
        email_error = ?
    WHERE id = ?
  `).run(status, sentAt, error || null, registrationId);
}

export function logPaymentEvent(
  registrationId: number | null,
  reference: string,
  eventType: string,
  payload: any
): void {
  db.prepare(`
    INSERT INTO payment_logs (registration_id, payment_reference, event_type, payload, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    registrationId,
    reference,
    eventType,
    typeof payload === 'string' ? payload : JSON.stringify(payload),
    new Date().toISOString()
  );
}

export function logEmailEvent(
  registrationId: number,
  recipientEmail: string,
  subject: string,
  status: 'sent' | 'failed',
  errorMessage?: string
): void {
  // Count prior attempts
  const prior = db.prepare(`SELECT COUNT(*) as c FROM email_logs WHERE registration_id = ?`).get(registrationId) as { c: number };
  const attempt = (prior?.c || 0) + 1;

  db.prepare(`
    INSERT INTO email_logs (registration_id, recipient_email, subject, status, error_message, attempt_number, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    registrationId,
    recipientEmail,
    subject,
    status,
    errorMessage || null,
    attempt,
    new Date().toISOString()
  );
}

// Admin metrics & analytics
export function getAdminMetrics(): {
  totalRegistrations: number;
  paidRegistrations: number;
  pendingRegistrations: number;
  failedRegistrations: number;
  totalRevenueNgn: number;
  byCategory: Record<string, number>;
  totalVisitors: number;
} {
  const totalRow = db.prepare(`SELECT COUNT(*) as count FROM registrations`).get() as { count: number };
  const paidRow = db.prepare(`SELECT COUNT(*) as count, SUM(amount_kobo) as revenue FROM registrations WHERE payment_status = 'paid'`).get() as { count: number; revenue: number | null };
  const pendingRow = db.prepare(`SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'pending'`).get() as { count: number };
  const failedRow = db.prepare(`SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'failed'`).get() as { count: number };
  
  const catRows = db.prepare(`SELECT age_category, COUNT(*) as count FROM registrations GROUP BY age_category`).all() as Array<{ age_category: string; count: number }>;
  const byCategory: Record<string, number> = {};
  for (const row of catRows) {
    byCategory[row.age_category] = row.count;
  }

  const visitorsRow = db.prepare(`SELECT COUNT(DISTINCT visitor_hash) as count FROM analytics_visits`).get() as { count: number };

  return {
    totalRegistrations: totalRow?.count || 0,
    paidRegistrations: paidRow?.count || 0,
    pendingRegistrations: pendingRow?.count || 0,
    failedRegistrations: failedRow?.count || 0,
    totalRevenueNgn: (paidRow?.revenue || 0) / 100,
    byCategory,
    totalVisitors: visitorsRow?.count || 0,
  };
}

export function getRegistrationStats(): { total: number; byCategory: Record<string, number> } {
  const metrics = getAdminMetrics();
  return {
    total: metrics.totalRegistrations,
    byCategory: metrics.byCategory,
  };
}

export function recordVisitorHit(pagePath: string, visitorHash: string): void {
  db.prepare(`
    INSERT INTO analytics_visits (page_path, visitor_hash, created_at)
    VALUES (?, ?, ?)
  `).run(pagePath, visitorHash, new Date().toISOString());
}

export interface RegistrationsQuery {
  search?: string;
  paymentStatus?: string;
  category?: string;
  emailStatus?: string;
  page?: number;
  limit?: number;
}

export function getAdminRegistrations(query: RegistrationsQuery): {
  registrations: RegistrationRecord[];
  total: number;
  page: number;
  totalPages: number;
} {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 15));
  const offset = (page - 1) * limit;

  let whereClauses: string[] = ['1=1'];
  const params: any[] = [];

  if (query.paymentStatus && query.paymentStatus !== 'all') {
    whereClauses.push('payment_status = ?');
    params.push(query.paymentStatus);
  }

  if (query.category && query.category !== 'all') {
    whereClauses.push('age_category LIKE ?');
    params.push(`%${query.category}%`);
  }

  if (query.emailStatus && query.emailStatus !== 'all') {
    whereClauses.push('email_status = ?');
    params.push(query.emailStatus);
  }

  if (query.search && query.search.trim().length > 0) {
    const term = `%${query.search.trim()}%`;
    whereClauses.push(`(
      registration_code LIKE ? OR
      child_name LIKE ? OR
      parent_name LIKE ? OR
      parent_email LIKE ? OR
      parent_phone LIKE ? OR
      payment_reference LIKE ? OR
      school_name LIKE ?
    )`);
    params.push(term, term, term, term, term, term, term);
  }

  const whereSql = whereClauses.join(' AND ');

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM registrations WHERE ${whereSql}`).get(...params) as { count: number };
  const total = countRow?.count || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const rows = db.prepare(`
    SELECT * FROM registrations 
    WHERE ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as any[];

  return {
    registrations: rows.map(mapRowToRecord),
    total,
    page,
    totalPages,
  };
}

// Admin user and session helpers
export function createAdminUser(params: {
  username: string;
  email: string;
  passwordPlainText: string;
  fullName: string;
  role?: string;
}): { id: number; username: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.scryptSync(params.passwordPlainText, salt, 64).toString('hex');
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO admin_users (username, email, password_hash, salt, full_name, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    params.username.trim().toLowerCase(),
    params.email.trim().toLowerCase(),
    passwordHash,
    salt,
    params.fullName.trim(),
    params.role || 'organizer',
    createdAt
  );

  return { id: Number(result.lastInsertRowid), username: params.username };
}

export function getAdminUserByUsernameOrEmail(identifier: string): any {
  const id = identifier.trim().toLowerCase();
  return db.prepare(`
    SELECT * FROM admin_users WHERE username = ? OR email = ?
  `).get(id, id);
}

export function verifyAdminPassword(plainText: string, storedHash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(plainText, salt, 64).toString('hex');
  const bufA = Buffer.from(testHash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createAdminSession(adminUserId: number, ttlDays = 7): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO admin_sessions (session_token, admin_user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(token, adminUserId, expiresAt, new Date().toISOString());
  return token;
}

export function validateAdminSession(sessionToken: string): {
  isValid: boolean;
  user?: { id: number; username: string; email: string; fullName: string; role: string };
} {
  if (!sessionToken) return { isValid: false };

  const session = db.prepare(`
    SELECT s.*, u.id as u_id, u.username, u.email, u.full_name, u.role
    FROM admin_sessions s
    JOIN admin_users u ON s.admin_user_id = u.id
    WHERE s.session_token = ?
  `).get(sessionToken) as any;

  if (!session) return { isValid: false };

  const expiresTime = new Date(session.expires_at).getTime();
  if (expiresTime < Date.now()) {
    // Delete expired session
    db.prepare(`DELETE FROM admin_sessions WHERE session_token = ?`).run(sessionToken);
    return { isValid: false };
  }

  return {
    isValid: true,
    user: {
      id: session.u_id,
      username: session.username,
      email: session.email,
      fullName: session.full_name,
      role: session.role,
    },
  };
}

export function revokeAdminSession(sessionToken: string): void {
  db.prepare(`DELETE FROM admin_sessions WHERE session_token = ?`).run(sessionToken);
}

export default db;
