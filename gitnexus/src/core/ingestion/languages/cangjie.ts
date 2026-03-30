/**
 * Cangjie (仓颉) language provider — `.cj` sources via tree-sitter-cangjie.
 */

import type { SyntaxNode } from '../utils/ast-helpers.js';
import { findCangjieTuLevelMemberOwningClass } from '../utils/ast-helpers.js';
import { SupportedLanguages } from '../../../config/supported-languages.js';
import { defineLanguage } from '../language-provider.js';
import type { LanguageProvider } from '../language-provider.js';

/** `import pkg.sub.{A, B}` → `pkg.sub` so package dir resolution matches on-disk layout. */
export const preprocessCangjieImportPath = (cleaned: string, _importNode: SyntaxNode): string => {
  const m = cleaned.match(/^(.*)\.\{[^}]*\}$/);
  return m ? m[1] : cleaned;
};
import { typeConfig as cangjieConfig } from '../type-extractors/cangjie.js';
import { cangjieExportChecker } from '../export-detection.js';
import { resolveCangjieImport } from '../import-resolvers/cangjie.js';
import { CANGJIE_QUERIES } from '../tree-sitter-queries.js';

const CJ_MEMBER_BODIES = new Set([
  'classBody',
  'structBody',
  'interfaceBody',
  'extendBody',
  'enumBody',
]);

export function isCangjieMemberFunctionDefinition(functionNode: SyntaxNode | null | undefined): boolean {
  if (!functionNode) return false;
  if (functionNode.type !== 'functionDefinition' && functionNode.type !== 'operatorFunctionDefinition') {
    return false;
  }
  let ancestor: SyntaxNode | null = functionNode.parent;
  while (ancestor) {
    if (CJ_MEMBER_BODIES.has(ancestor.type)) return true;
    ancestor = ancestor.parent;
  }
  return findCangjieTuLevelMemberOwningClass(functionNode) !== null;
}

/** Reclassify members as Method (Kotlin-style). Duplicate `@definition.method` query patterns were removed — single `@definition.function` match only. */
const cangjieLabelOverride: NonNullable<LanguageProvider['labelOverride']> = (functionNode, defaultLabel) => {
  if (defaultLabel !== 'Function') return defaultLabel;
  return isCangjieMemberFunctionDefinition(functionNode) ? 'Method' : defaultLabel;
};

export const cangjieProvider = defineLanguage({
  id: SupportedLanguages.Cangjie,
  extensions: ['.cj'],
  treeSitterQueries: CANGJIE_QUERIES,
  typeConfig: cangjieConfig,
  exportChecker: cangjieExportChecker,
  importResolver: resolveCangjieImport,
  importPathPreprocessor: preprocessCangjieImportPath,
  importSemantics: 'wildcard',
  labelOverride: cangjieLabelOverride,
});
