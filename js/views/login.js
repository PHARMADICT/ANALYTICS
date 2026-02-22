/**
 * js/views/login.js — Simple PIN login. One screen, one PIN.
 */
import { verifyPin } from '../services/auth.js';
import { setAuth }   from '../store/index.js';

export function initLogin(onSuccess) {
  const input = document.getElementById('input-pin');
  const btn   = document.getElementById('btn-login');
  const err   = document.getElementById('login-error');

  const attempt = () => {
    const pin = input?.value?.trim() || '';
    const result = verifyPin(pin);
    if (result.ok) {
      setAuth({ loggedIn: true, role: result.role, user: result.user });
      onSuccess(result);
    } else {
      if (err) { err.textContent = result.error; err.hidden = false; }
      if (input) { input.value = ''; input.focus(); }
      shake();
    }
  };

  btn?.addEventListener('click', attempt);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });

  // Auto-focus PIN field
  setTimeout(() => input?.focus(), 100);
}

function shake() {
  const card = document.querySelector('.login-card');
  if (!card) return;
  card.style.animation = 'none';
  requestAnimationFrame(() => {
    card.style.animation = 'shake 0.35s ease';
    setTimeout(() => card.style.animation = '', 400);
  });
}
