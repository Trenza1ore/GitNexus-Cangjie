# Ingestion pipeline, queries, resolvers, workers

## `src/core/ingestion/resolvers/utils.ts`

- Adds extension **`.cj`** under a **Cangjie** comment in the shared extension list.

## `src/core/ingestion/tree-sitter-queries.ts`

- New exported constant **`CANGJIE_QUERIES`** (large block): classes, interfaces, structs, enums, free functions/operators, **type-member** functions/operators mapped to **`@definition.method`**, macros, type aliases, properties, variables, **`init`**, imports (`importList` / `packageName`), calls via **`postfixExpression`** + **`callSuffix`**, heritage (`superOrInterface`), assignments.
- **`LANGUAGE_QUERIES`:** **`[SupportedLanguages.Cangjie]: CANGJIE_QUERIES`**.

## `src/core/ingestion/type-extractors/index.ts`

- Imports **`cangjieConfig`** from **`./cangjie.js`**.
- **`typeConfigs`** adds **`[SupportedLanguages.Cangjie]: cangjieConfig`**.

## `src/core/ingestion/type-extractors/cangjie.ts` (new file)

- Exports **`typeConfig`** with empty declaration node set and **no-op** declaration/parameter extractors (“minimal type env — static inference can be added later”).

## `src/core/ingestion/call-routing.ts`

- **`[SupportedLanguages.Cangjie]: noRouting`** (same as languages without call-specific routers).

## `src/core/ingestion/entry-point-scoring.ts`

- **`LANGUAGE_ENTRY_PATTERNS`** gains **`[SupportedLanguages.Cangjie]: [/^main$/]`** (comment: shared main/func conventions).

## `src/core/ingestion/export-detection.ts`

- New **`cangjieExportChecker`:** walks ancestors for **`modifiers`**; **`private` / `internal`** → not exported; **`public` / `protected`** → exported; default **true** (package-visible).
- **`EXPORT_CHECKERS`:** **`[SupportedLanguages.Cangjie]: cangjieExportChecker`**.

## `src/core/ingestion/import-processor.ts`

- New **`matchCangjiePackageImport(...)`:** maps dotted package paths to on-disk **`cangjie/...`** directories with sliding window + suffix index **`getFilesInDir(..., '.cj')`**; tries prefixes **`cangjie/`** and **`''`**.
- **`resolveImportPath` / equivalent flow:**
  - **Wildcard** imports ending in **`.*`** handled **before** standard resolution for Cangjie.
  - After single-file resolution fails, **Cangjie** retry with **`stripTrailingSymbol: true`** for qualified / brace-list style imports.
- **Null parse trees:** **`if (!tree) continue`** before caching in the reparsing loop; optional chaining **`(tree as any)?.delete?.()`** when reparsed.

## `src/core/ingestion/parsing-processor.ts`

- After parse, **`if (!tree)`** → warn **`Skipping file with null parse tree`** and **`continue`**.
- **Cangjie-only:** when labeling **Function** from **`@definition.function`**, if node is **`functionDefinition`** / **`operatorFunctionDefinition`**, skip if inside **`classBody` | `structBody` | `interfaceBody` | `extendBody` | `enumBody`** (members use **`@definition.method`**).

## `src/core/ingestion/call-processor.ts` / `heritage-processor.ts`

- **`if (!tree) continue`** before **`astCache.set`** after parse in loops.
- Import-processor already notes **`?.delete?.()`** pattern alignment.

## `src/core/ingestion/ast-cache.ts`

- **`(tree as any)?.delete?.()`** instead of **`(tree as any).delete?.()`** (null-safe on tree).

## `src/core/ingestion/utils.ts` (largest behavioral diff)

1. **`DEFINITION_CAPTURE_KEYS`:** **`definition.method`** moved **before** **`definition.function`** so method captures win when both exist.
2. **`FUNCTION_DECLARATION_TYPES`:** adds **`functionDefinition`**, **`operatorFunctionDefinition`**, **`init`** (Cangjie).
3. **`findEnclosingClassId`:** Cangjie containers **`classDefinition`**, **`interfaceDefinition`**, **`structDefinition`**, **`enumDefinition`** (name children **`className`**, etc.); **`extendDefinition`** via **`extendType`** / identifier / scoped_identifier.
4. **`getFunctionNameAndLabel`:** **`init`** node → constructor; **`functionDefinition` / `operatorFunctionDefinition`** walk **`funcName` / `operator`**.
5. **`getLanguageFromFilename`:** **`.cj`** → **`Cangjie`**, with comment **must precede `.c`**.
6. **`extractSignatureInfo` / param lists:** adds **`parameterList`** to the param-list type set; Cangjie **`returnType`** field when not `Unit`.
7. **`countCallArguments`:** **`postfixExpression`** + **`callSuffix`**: count non-comment named children.
8. **Member/call shapes:** **`fieldAccess`** in several maps; **`postfixExpression`** handling for **member vs free** calls; **`thisSuperExpression`** for receiver keywords; **`extractReceiverName`** extended for Cangjie **`fieldAccess`** / nested **`postfixExpression`** (two similar blocks in diff); **`CALL_WRAPPER_NODE_TYPES`** includes **`postfixExpression`** when query captures call-shaped postfix.

## `src/core/ingestion/workers/parse-worker.ts`

- **`import cangjiePkg from 'tree-sitter-cangjie'`**; **`LANGUAGE_LOADERS`** includes **`[SupportedLanguages.Cangjie]: cangjiePkg`**.
- **Node label precedence:** **`definition.method`** is checked **before** **`definition.function`** (matches **`DEFINITION_CAPTURE_KEYS`** order).
- **`if (!tree) continue`** after parse failure path.
- **Cangjie duplicate function skip:** same member-body check as **`parsing-processor.ts`** when emitting symbols (**`continue`** if inside type body).
