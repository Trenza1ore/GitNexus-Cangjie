/**
 * Cangjie import resolution — dotted package paths and Harmony-style `cangjie/` layout.
 */

import { SupportedLanguages } from '../../../config/supported-languages.js';
import type { ImportResult, ImportResolverFn, ResolveCtx } from './types.js';
import type { SuffixIndex } from './utils.js';
import { resolveImportPath } from './standard.js';

/**
 * Map dotted Cangjie package paths (e.g. ohos_app_cangjie_entry.services.*) to on-disk
 * `cangjie/...` directories. Harmony projects use a logical package root that does not
 * appear as a path prefix; we slide window + try `cangjie/` prefix like Java suffix rules.
 */
function matchCangjiePackageImport(
  rawImportPath: string,
  index: SuffixIndex,
  options: { isWildcard: boolean; stripTrailingSymbol: boolean },
): ImportResult {
  let pathBody = rawImportPath;
  if (options.isWildcard) {
    if (!pathBody.endsWith('.*')) return null;
    pathBody = pathBody.slice(0, -2);
  }
  const pathLike = pathBody.replace(/\./g, '/');
  const segs = pathLike.split('/').filter(Boolean);
  if (segs.length === 0) return null;

  const candidateSegLists: string[][] = [segs];
  if (options.stripTrailingSymbol && segs.length >= 2) {
    candidateSegLists.push(segs.slice(0, -1));
  }

  for (const s of candidateSegLists) {
    for (let i = 0; i < s.length; i++) {
      const tail = s.slice(i).join('/');
      for (const prefix of ['cangjie/', '']) {
        const dir = prefix + tail;
        const files = index.getFilesInDir(dir, '.cj');
        if (files.length > 0) {
          const dirNorm = dir.replace(/\/+$/, '');
          return { kind: 'package', files, dirSuffix: `/${dirNorm}/` };
        }
      }
    }
  }
  return null;
}

export const resolveCangjieImport: ImportResolverFn = (
  rawImportPath: string,
  filePath: string,
  ctx: ResolveCtx,
): ImportResult => {
  const { allFilePaths, allFileList, normalizedFileList, index, resolveCache, configs } = ctx;

  if (rawImportPath.endsWith('.*')) {
    const wild = matchCangjiePackageImport(rawImportPath, index, { isWildcard: true, stripTrailingSymbol: false });
    if (wild) return wild;
    return null;
  }

  const resolvedPath = resolveImportPath(
    filePath,
    rawImportPath,
    allFilePaths,
    allFileList,
    normalizedFileList,
    resolveCache,
    SupportedLanguages.Cangjie,
    configs.tsconfigPaths,
    index,
  );
  if (resolvedPath) return { kind: 'files', files: [resolvedPath] };

  const pkg = matchCangjiePackageImport(rawImportPath, index, { isWildcard: false, stripTrailingSymbol: true });
  if (pkg) return pkg;
  return null;
};
