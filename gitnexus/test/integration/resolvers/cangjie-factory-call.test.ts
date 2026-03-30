/**
 * Cangjie: `getCore().parse()` must resolve to the service method, not a same-file `parse` shadow.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import { FIXTURES, getRelationships, type PipelineResult, runPipelineFromRepo } from './helpers.js';

describe('Cangjie factory + member call resolution', () => {
  let result: PipelineResult;

  beforeAll(async () => {
    result = await runPipelineFromRepo(
      path.join(FIXTURES, 'cangjie-factory-call'),
      () => {},
    );
  }, 60000);

  it('resolves getCore().parse() to Core.parse (not Adapter.parse)', () => {
    const calls = getRelationships(result, 'CALLS');
    const factoryParse = calls.find(
      c => c.source === 'viaFactory' && c.target === 'parse',
    );
    expect(factoryParse).toBeDefined();
    expect(factoryParse!.targetFilePath).toContain('example/svc/Core.cj');
    expect(factoryParse!.targetFilePath).not.toContain('Adapter.cj');
  });

  it('indexes exported getCore for package resolution', () => {
    const getCoreNodes: string[] = [];
    result.graph.forEachNode(n => {
      if (n.properties.name === 'getCore' && n.label === 'Function') {
        getCoreNodes.push(String(n.properties.filePath ?? ''));
      }
    });
    expect(getCoreNodes.some(p => p.includes('Core.cj'))).toBe(true);
  });

  it('stores return type on getCore for call chaining', () => {
    let returnType = '';
    result.graph.forEachNode(n => {
      if (n.properties.name === 'getCore' && n.label === 'Function') {
        returnType = String(n.properties.returnType ?? '');
      }
    });
    expect(returnType).toMatch(/Core/i);
  });
});
