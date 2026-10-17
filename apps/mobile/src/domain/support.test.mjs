import assert from 'node:assert/strict';
import test from 'node:test';
import { buildIncidentHelpSummary, incidentSteps } from './support.ts';

test('builds a content-free incident response checklist', () => {
  const summary = buildIncidentHelpSummary();
  assert.equal(incidentSteps.length, 4);
  assert.match(summary, /Ödemeyi durdurun/);
  assert.match(summary, /kişisel veri içermez/);
  assert.match(summary, /tavsiye değildir/);
});
