import test from 'node:test';
import assert from 'node:assert/strict';
import { filters, projects } from '../src/data.js';

test('project catalog has unique, numbered, linked entries with valid categories', () => {
  assert.equal(projects.length, 10);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  assert.equal(new Set(projects.map(p => p.repo)).size, projects.length);
  projects.forEach((project, index) => {
    assert.equal(project.number, String(index + 1).padStart(2, '0'));
    assert.ok(filters.includes(project.category), 'Invalid category: ' + project.category);
    assert.equal(project.link, 'https://github.com/JP-bott/' + project.repo);
    assert.ok(project.title && project.question && project.approach && project.data);
  });
});

test('Philippine Economic Intelligence is a discoverable, featured, PSA-based case study', () => {
  const project = projects.find(p => p.id === 'philippine-economic-intelligence');
  assert.ok(project);
  assert.equal(project.repo, 'Philippine-Economic-Intelligence-Dashboard');
  assert.equal(project.featured, true);
  assert.equal(project.category, 'Geospatial');
  assert.match(project.description, /18.region/i);
  assert.match(project.data, /published PSA statistics/i);
  assert.match(project.data, /July 2025/);
  assert.match(project.data, /not live/i);
  assert.ok(project.tags.includes('PSA OpenSTAT'));
});
