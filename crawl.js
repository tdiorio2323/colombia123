#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const BASE = process.env.BASE_URL;
if (!BASE) {
  console.error('Set BASE_URL');
  process.exit(1);
}

const origin = new URL(BASE).origin;
const seen = new Set();
const toVisit = [BASE];
const results = [];

async function fetchHtml(url) {
  try {
    const res = await axios.get(url, { maxRedirects: 5, timeout: 15000, headers: { 'User-Agent': 'AuditBot/1.0' } });
    return { status: res.status, html: res.data, url: res.request.res?.responseUrl || url };
  } catch (e) {
    return { status: e.response?.status || 0, html: '', url };
  }
}

function isInternal(link) {
  try {
    const u = new URL(link, origin);
    return u.origin === origin;
  } catch {
    return false;
  }
}

(async () => {
  while (toVisit.length) {
    const url = toVisit.shift();
    if (seen.has(url)) continue;
    seen.add(url);

    const { status, html } = await fetchHtml(url);
    results.push({ url, status });

    if (status >= 200 && status < 300 && html && html.includes('<html')) {
      const $ = cheerio.load(html);
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        try {
          const abs = new URL(href, origin).href.split('#')[0];
          if (isInternal(abs) && !seen.has(abs)) toVisit.push(abs);
        } catch {}
      });
    }
  }

  console.log('URL,STATUS');
  for (const r of results) console.log(`${r.url},${r.status}`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});