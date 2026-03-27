#!/usr/bin/env node
/**
 * WORKAROUND: tree-sitter-cangjie + npm tree-sitter runtime
 *
 * tree-sitter-cangjie exposes `language` as `Napi::External<TSLanguage>` with the
 * standard BLAKE2 type tag, but `binding.getNodeTypeNamesById(language)` returns
 * undefined — the handles are not interchangeable across this native boundary in
 * some builds. Without node type names, `initializeLanguageNodeClasses` throws and
 * `setLanguage` fails before any parse.
 *
 * Fix: skip subclass generation when introspection fails, and fall back to the base
 * `SyntaxNode` class when `language.nodeSubclasses[id]` is missing (field-specific
 * getters won't exist; `.type`, `.text`, `.children`, and queries still work).
 */
const fs = require('fs');
const path = require('path');

const marker = '/* gitnexus-cangjie-compat */';
const indexPath = path.join(__dirname, '..', 'node_modules', 'tree-sitter', 'index.js');

function patch() {
  if (!fs.existsSync(indexPath)) {
    process.exit(0);
  }
  let src = fs.readFileSync(indexPath, 'utf8');
  if (src.includes(marker)) {
    return;
  }

  const initNeedle = `function initializeLanguageNodeClasses(language) {
  const nodeTypeNamesById = binding.getNodeTypeNamesById(language);
  const nodeFieldNamesById = binding.getNodeFieldNamesById(language);
  const nodeTypeInfo = language.nodeTypeInfo || [];`;

  const initReplacement = `function initializeLanguageNodeClasses(language) {
  const nodeTypeNamesById = binding.getNodeTypeNamesById(language);
  const nodeFieldNamesById = binding.getNodeFieldNamesById(language);
  ${marker}
  if (!nodeTypeNamesById || !nodeFieldNamesById) {
    return;
  }
  const nodeTypeInfo = language.nodeTypeInfo || [];`;

  const unmarshalNeedle = `  const NodeClass = nodeTypeId === ERROR_TYPE_ID
    ? SyntaxNode
    : tree.language.nodeSubclasses[nodeTypeId];`;

  const unmarshalReplacement = `  const NodeClass = nodeTypeId === ERROR_TYPE_ID
    ? SyntaxNode
    : (tree.language.nodeSubclasses && tree.language.nodeSubclasses[nodeTypeId]) || SyntaxNode;`;

  if (!src.includes(initNeedle) || !src.includes(unmarshalNeedle)) {
    console.warn('[tree-sitter-cangjie-compat] tree-sitter index.js layout changed; patch skipped');
    return;
  }

  src = src.replace(initNeedle, initReplacement);
  src = src.replace(unmarshalNeedle, unmarshalReplacement);
  fs.writeFileSync(indexPath, src, 'utf8');
  console.log('[tree-sitter-cangjie-compat] Patched node_modules/tree-sitter/index.js for Cangjie External languages');
}

try {
  patch();
} catch (e) {
  console.warn('[tree-sitter-cangjie-compat]', e.message);
}
