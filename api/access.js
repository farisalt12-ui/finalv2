
const crypto = require('crypto');

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const username = String(body.username ?? body.u ?? '').trim();
    const password = String(body.password ?? body.p ?? '');
    const pmd5Raw = body.pmd5 ? String(body.pmd5) : '';
    const pmd5 = pmd5Raw ? pmd5Raw.trim().toUpperCase() : crypto.createHash('md5').update(password).digest('hex').toUpperCase();

    if (!username || !pmd5) return json(res, 400, { ok: false, error: 'missing_credentials' });

    const form = new URLSearchParams({ u: username, p: pmd5 });
    const response = await fetch('https://violetbot.net:6963/check/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const text = String(await response.text()).trim();
    const low = text.toLowerCase();
    if (!text || low === 'unknown_err') return json(res, 502, { ok: false, error: 'auth_proxy_failed', raw: text });
    if (low === 'wrong_creds' || low === 'id_empty') return json(res, 401, { ok: false, error: low });

    return json(res, 200, { ok: true, id: text });
  } catch (err) {
    return json(res, 502, {
      ok: false,
      error: 'auth_proxy_failed',
      details: err && err.message ? String(err.message) : String(err)
    });
  }
};
