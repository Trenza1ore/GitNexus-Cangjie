/**
 * Cangjie: `this.field.method()` must use field type (initializer factory return type), not self.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { FIXTURES, getRelationships, type PipelineResult, runPipelineFromRepo } from './helpers.js';

describe('Cangjie this.field member resolution', () => {
  let result: PipelineResult;

  beforeAll(async () => {
    result = await runPipelineFromRepo(
      path.join(FIXTURES, 'cangjie-this-field-member'),
      () => {},
    );
  }, 60000);

  it('resolves this.engine.engineGet() to Engine.engineGet (not Provider.fetchSettings self)', () => {
    const calls = getRelationships(result, 'CALLS');
    const edge = calls.find(
      c => c.source === 'fetchSettings' && c.target === 'engineGet',
    );
    expect(edge).toBeDefined();
    expect(edge!.targetFilePath).toContain('Engine.cj');
    expect(edge!.targetFilePath).not.toContain('Provider.cj');
  });

  it('resolves typed private var field: `private var engine: Engine = getEngineService()`', () => {
    const calls = getRelationships(result, 'CALLS');
    const edge = calls.find(
      c => c.source === 'fetchTyped' && c.target === 'engineGet',
    );
    expect(edge).toBeDefined();
    expect(edge!.targetFilePath).toContain('Engine.cj');
    expect(edge!.targetFilePath).not.toContain('TypedProvider.cj');
  });
});
