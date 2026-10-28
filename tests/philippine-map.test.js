import test from 'node:test';
import assert from 'node:assert/strict';
import { philippineRegionPaths } from '../src/philippineRegionPaths.js';
test('map artwork uses 18 authentic regional SVG boundaries', () => {
  assert.equal(philippineRegionPaths.length, 18);
  assert.equal(new Set(philippineRegionPaths.map(r => r.id)).size, 18);
  assert.ok(philippineRegionPaths.some(r => r.id === 1800000000 && /Negros Island/.test(r.name)));
  assert.ok(philippineRegionPaths.some(r => r.id === 1300000000 && /National Capital/.test(r.name)));
  assert.ok(philippineRegionPaths.every(r => /^M[\d.,]+(?:L[\d.,]+)*Z/.test(r.d) && r.d.length >= 12));
  assert.ok(philippineRegionPaths.some(r => r.d.length > 1000), 'Coastlines must have meaningful detail');
});
