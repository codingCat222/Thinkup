import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';

const dbPath = path.join(process.cwd(), 'data', 'registrations.db');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Ensure admin_users table exists
db.exec(`
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
`);

const args = process.argv.slice(2);
const username = (args[0] || 'admin').toLowerCase().trim();
const email = (args[1] || 'admin@thinkupinnovations.com').toLowerCase().trim();
const password = args[2] || 'ThinkUpAdmin2026!';
const fullName = args[3] || 'ThinkUp Event Lead';

// Check if user already exists
const existing = db.prepare(`SELECT * FROM admin_users WHERE username = ? OR email = ?`).get(username, email);

if (existing) {
  console.log(`\n⚠️  Admin account already exists for username "${username}" or email "${email}".`);
  console.log(`   ID: ${existing.id}`);
  console.log(`   Full Name: ${existing.full_name}`);
  console.log(`   Role: ${existing.role}\n`);
  process.exit(0);
}

const salt = crypto.randomBytes(16).toString('hex');
const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
const createdAt = new Date().toISOString();

const result = db.prepare(`
  INSERT INTO admin_users (username, email, password_hash, salt, full_name, role, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(username, email, passwordHash, salt, fullName, 'organizer', createdAt);

console.log(`\n✅ Administrator Account Created Successfully!`);
console.log(`-----------------------------------------------`);
console.log(`Username:  ${username}`);
console.log(`Email:     ${email}`);
console.log(`Password:  ${password}`);
console.log(`Role:      organizer`);
console.log(`Admin URL: /admin/login\n`);

