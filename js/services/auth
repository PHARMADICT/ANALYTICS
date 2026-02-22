/**
 * js/services/auth.js
 * Single PIN: 1234 = full admin/master access
 * Simple, no drag, no hold, no complexity.
 */
import { db } from './db.js';

const CONFIG = {
  pin:         '1234',
  maxAttempts: 5,
  lockoutMs:   60000,
};

function getAttempts() { return db.get('auth__attempts') || 0; }
function getLockout()  { return db.get('auth__lockout')  || 0; }
function resetAuth()   { db.del('auth__attempts'); db.del('auth__lockout'); }

function lockSecsRemaining() {
  const rem = getLockout() - Date.now();
  return rem > 0 ? Math.ceil(rem / 1000) : 0;
}

function bumpAttempt() {
  const count = getAttempts() + 1;
  db.set('auth__attempts', count);
  if (count >= CONFIG.maxAttempts) {
    db.set('auth__lockout', Date.now() + CONFIG.lockoutMs);
    return { locked: true };
  }
  return { locked: false, remaining: CONFIG.maxAttempts - count };
}

/**
 * Verify PIN — returns { ok, role, user, error }
 * PIN 1234 → master (full admin access)
 */
export function verifyPin(pin) {
  const secs = lockSecsRemaining();
  if (secs > 0) return { ok: false, error: `Too many attempts. Wait ${secs}s.` };

  if (pin.trim() === CONFIG.pin) {
    resetAuth();
    return { ok: true, role: 'master', user: 'Admin' };
  }

  const r = bumpAttempt();
  if (r.locked) return { ok: false, error: 'Locked for 60 seconds.' };
  return { ok: false, error: `Wrong PIN. ${r.remaining} attempt(s) left.` };
}

export function clearSession() { /* no-op */ }
