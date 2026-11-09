// Checks every article in artikel/<id>/{de,en}.md and writes index.json plus the article list in README.md.
// Runs in GitHub Actions on every push; fails (and leaves the website on the previous index) if a check fails.
// No dependencies. MIT licence.
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SITE = 'https://nuitnoirecustom.ch';
const BASE = { de: '/werkstatt', en: '/en/workshop' };
const STATUS = ['in-test', 'solved', 'open'];
const errors = [];

function frontMatter(src, file) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) { errors.push(`${file}: front matter (--- … ---) is missing`); return { meta: {}, body: src }; }
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    meta[kv[1]] = v;
  }
  return { meta, body: src.slice(m[0].length) };
}

const words = (md) => md.replace(/[#>*_`|[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
const VIN = /\b(?=[A-HJ-NPR-Z0-9]*\d)(?=[A-HJ-NPR-Z0-9]*[A-HJ-NPR-Z])[A-HJ-NPR-Z0-9]{17}\b/;

const dir = join(ROOT, 'artikel');
const ids = existsSync(dir) ? readdirSync(dir).filter((d) => statSync(join(dir, d)).isDirectory()).sort() : [];
const articles = [];
const seen = { de: new Set(), en: new Set() };

for (const id of ids) {
  if (!/^[a-z0-9-]+$/.test(id)) { errors.push(`artikel/${id}: folder name may only use a-z, 0-9 and -`); continue; }
  const langs = {};
  let shared = null;
  for (const lang of ['de', 'en']) {
    const rel = `artikel/${id}/${lang}.md`, path = join(ROOT, rel);
    if (!existsSync(path)) continue;
    const src = readFileSync(path, 'utf8');
    const { meta, body } = frontMatter(src, rel);
    for (const k of ['title', 'description', 'date', 'slug']) if (!meta[k]) errors.push(`${rel}: "${k}" is missing`);
    if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) errors.push(`${rel}: date must look like 2026-11-30`);
    if (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) errors.push(`${rel}: updated must look like 2026-11-30`);
    if (meta.slug && !/^[a-z0-9-]+$/.test(meta.slug)) errors.push(`${rel}: slug may only use a-z, 0-9 and -`);
    if (meta.slug && seen[lang].has(meta.slug)) errors.push(`${rel}: slug "${meta.slug}" is used twice`);
    if (meta.status && !STATUS.includes(meta.status)) errors.push(`${rel}: status must be one of ${STATUS.join(', ')}`);
    if (/<!--\s*TODO/i.test(src)) errors.push(`${rel}: still contains a TODO note`);
    if (VIN.test(body)) errors.push(`${rel}: looks like it contains a VIN; remove it`);
    if (meta.description && meta.description.length > 200) errors.push(`${rel}: description is longer than 200 characters`);
    if (meta.slug) seen[lang].add(meta.slug);
    langs[lang] = { slug: meta.slug, title: meta.title, description: meta.description, file: rel, minutes: Math.max(1, Math.round(words(body) / 200)) };
    if (!shared) shared = meta;
  }
  if (!shared) continue;
  articles.push({
    id, date: shared.date, updated: shared.updated || null, status: shared.status || 'open',
    vehicle: shared.vehicle || null, topic: shared.topic || null, cover: shared.cover || null, langs,
  });
}

if (errors.length) {
  console.error('Articles not published, please fix:\n- ' + errors.join('\n- '));
  process.exit(1);
}

articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
writeFileSync(join(ROOT, 'index.json'), JSON.stringify({ articles }, null, 2) + '\n');

const list = articles.length
  ? articles.map((a) => {
      const parts = [];
      if (a.langs.de) parts.push(`[${a.langs.de.title}](artikel/${a.id}/de.md) · [Website](${SITE}${BASE.de}/${a.langs.de.slug})`);
      if (a.langs.en) parts.push(`EN: [${a.langs.en.title}](artikel/${a.id}/en.md) · [Website](${SITE}${BASE.en}/${a.langs.en.slug})`);
      return `- **${a.date}**${a.vehicle ? ` · ${a.vehicle}` : ''}\n  ${parts.join('  \n  ')}`;
    }).join('\n')
  : '_No articles yet. / Noch keine Artikel._';
const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const next = readme.replace(/(<!-- ARTIKEL:START -->)[\s\S]*?(<!-- ARTIKEL:END -->)/, `$1\n${list}\n$2`);
if (next !== readme) writeFileSync(readmePath, next);
console.log(`${articles.length} article(s) in index.json`);
