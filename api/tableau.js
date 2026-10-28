export const TABLEAU_USERNAME = 'john.torres1912';
export const TABLEAU_PROFILE = 'https://public.tableau.com/app/profile/john.torres1912/vizzes';
const ORIGIN = 'https://public.tableau.com';
const SAFE = /^[A-Za-z0-9._~-]+$/;
function segment(value) {
  const s = String(value || '').trim();
  return SAFE.test(s) && s !== '.' && s !== '..' ? s : null;
}
function rowsFrom(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return null;
  for (const candidate of [value.workbooks, value.results, value.items, value.data, value.content]) {
    const rows = rowsFrom(candidate);
    if (rows) return rows;
  }
  return null;
}
function date(value) {
  if (!value) return null;
  const n = Number(value);
  const d = Number.isFinite(n) && String(value).trim() !== '' ? new Date(n < 1e11 ? n * 1000 : n) : new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
export function normalizeWorkbook(v) {
  if (!v || v.showInProfile === false || v.isHidden === true) return null;
  const defaultView = String(v.defaultViewRepoUrl || '').replace('/sheets/', '/').split('/').filter(Boolean);
  const book = segment(String(v.workbookRepoUrl || defaultView[0] || '').split('/')[0]);
  const view = segment(defaultView.at(-1) || v.defaultViewName);
  const title = String(v.title || v.name || '').trim().slice(0, 180);
  if (!book || !view || !title) return null;
  const path = book + '/' + view;
  const views = Number(v.viewCount);
  return {
    id: path, title,
    description: typeof v.description === 'string' ? v.description.replace(/<[^>]+>/g,'').slice(0,350) : '',
    published: date(v.firstPublishDate),
    updated: date(v.lastPublishDate),
    views: Number.isFinite(views) && views >= 0 ? views : null,
    url: ORIGIN + '/app/profile/' + TABLEAU_USERNAME + '/viz/' + path,
    thumbnail: ORIGIN + '/thumb/views/' + path,
    embedUrl: ORIGIN + '/views/' + path + '?:showVizHome=no&:embed=true&:toolbar=no'
  };
}
export async function fetchTableauWorkbooks(request = fetch) {
  const found = new Map();
  for (let page=0;page<4;page++) {
    const endpoint = new URL(ORIGIN + '/public/apis/workbooks');
    endpoint.searchParams.set('profileName', TABLEAU_USERNAME);
    endpoint.searchParams.set('start', String(page * 50));
    endpoint.searchParams.set('count', '50');
    endpoint.searchParams.set('visibility','NON_HIDDEN');
    const response = await request(endpoint.toString(), {headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('Tableau unavailable: '+response.status);
    const rows = rowsFrom(await response.json());
    if (!rows) throw new Error('Unexpected Tableau response');
    for (const raw of rows) {
      const v = normalizeWorkbook(raw);
      if (v) found.set(v.id,v);
    }
    if (rows.length < 50) break;
  }
  return [...found.values()].sort((a,b)=>String(b.published || b.updated || '').localeCompare(String(a.published || a.updated || '')) || a.title.localeCompare(b.title));
}
export default async function handler(req,res) {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET');
    res.statusCode=405;
    res.end(JSON.stringify({error:'Method not allowed'}));
    return;
  }
  try {
    const workbooks=await fetchTableauWorkbooks();
    res.setHeader('Cache-Control','public, s-maxage=14400, stale-while-revalidate=86400');
    res.statusCode=200;
    res.end(JSON.stringify({profileUrl:TABLEAU_PROFILE,workbooks}));
  } catch {
    res.setHeader('Cache-Control','no-store');
    res.statusCode=503;
    res.end(JSON.stringify({error:'Tableau Public temporarily unavailable',profileUrl:TABLEAU_PROFILE}));
  }
}
