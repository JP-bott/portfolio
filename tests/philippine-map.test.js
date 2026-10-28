import test from 'node:test';
import assert from 'node:assert/strict';
import { philippineRegionPaths } from '../src/philippineRegionPaths.js';
import { readFileSync } from 'node:fs';
test('map artwork uses 18 authentic regional SVG boundaries', () => {
  assert.equal(philippineRegionPaths.length, 18);
  assert.equal(new Set(philippineRegionPaths.map(r => r.id)).size, 18);
  assert.ok(philippineRegionPaths.some(r => r.id === 1800000000 && /Negros Island/.test(r.name)));
  assert.ok(philippineRegionPaths.some(r => r.id === 1300000000 && /National Capital/.test(r.name)));
  assert.ok(philippineRegionPaths.every(r => /^M[\d.,]+(?:L[\d.,]+)*Z/.test(r.d) && r.d.length >= 12));
  assert.ok(philippineRegionPaths.some(r => r.d.length > 1000), 'Coastlines must have meaningful detail');
});

test('both Philippine map gallery cards reuse authentic geographic geometry', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const economy = source.split("case 'economy': return")[1]?.split("case 'geo': return")[0];
  const logistics = source.split("case 'geo': return")[1]?.split("case 'retail': return")[0];
  assert.ok(economy?.includes('philippineRegionPaths.map'), 'Economic art must reuse accurate polygons');
  assert.ok(logistics?.includes('philippineRegionPaths.map'), 'Logistics art must reuse accurate polygons');
  assert.ok(logistics?.includes('ILLUSTRATIVE HUBS + ROUTES'), 'Shipping routes must be labeled as illustrative');
});
