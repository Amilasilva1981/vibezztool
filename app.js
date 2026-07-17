// Shared utilities for VibezzTool
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
});

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast((label || 'Copied') + ' ✓');
  } catch (e) {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast((label || 'Copied') + ' ✓');
  }
}

// Transparency notice shown when a sponsored tab may open — distinct from
// showToast (longer on screen, clearer copy) since this message needs to
// actually be read, not just glanced at. This is a secondary reassurance;
// the primary safety net is the static warning text printed next to each
// button in the page HTML itself (visible before the click even happens,
// which is what makes this reliable on mobile — see sponsor-notice class).
function showAdNotice(msg) {
  let n = document.querySelector('.ad-notice');
  if (!n) {
    n = document.createElement('div');
    n.className = 'ad-notice';
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(n._timer);
  n._timer = setTimeout(() => n.classList.remove('show'), 4000);
}

// Opens one sponsored tab per page visit (not per click) — prevents tab-spam
// on tools where the same button gets clicked repeatedly (Generate, Copy,
// Download). Never delays the tool's real action (download/copy), which is
// handled natively by the browser and always completes regardless of what
// happens to the tab afterward.
const SPONSORED_LINK = 'https://omg10.com/4/11323997';
let _sponsoredFired = false;
function triggerSponsoredTab() {
  if (_sponsoredFired) return;
  _sponsoredFired = true;
  try { window.open(SPONSORED_LINK, '_blank', 'noopener,noreferrer'); } catch (e) {}
}
