/**
 * Cangjie: `import pkg.{foo}` must register package imports (importList uses subGroupOfPackage, not packageName).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { FIXTURES, getRelationships, type PipelineResult, runPipelineFromRepo } from './helpers.js';

describe('Cangjie brace / selective package import', () => {
  let result: PipelineResult;

  beforeAll(async () => {
    result = await runPipelineFromRepo(
      path.join(FIXTURES, 'cangjie-brace-import'),
      () => {},
    );
  }, 60000);

  it('resolves this.engine.engineGet() when service factory is imported via pkg.{sym}', () => {
    const calls = getRelationships(result, 'CALLS');
    const edge = calls.find(
      c => c.source === 'fetchSettings' && c.target === 'engineGet',
    );
    expect(edge).toBeDefined();
    expect(edge!.targetFilePath).toContain('Engine.cj');
    expect(edge!.targetFilePath).not.toContain('Provider.cj');
  });
});
