import type { LanguageTypeConfig, ParameterExtractor, TypeBindingExtractor } from './types.js';

const noopDecl: TypeBindingExtractor = () => {};
const noopParam: ParameterExtractor = () => {};

/** Minimal type env for Cangjie — static inference can be added later. */
export const typeConfig: LanguageTypeConfig = {
  declarationNodeTypes: new Set<string>(),
  extractDeclaration: noopDecl,
  extractParameter: noopParam,
};
