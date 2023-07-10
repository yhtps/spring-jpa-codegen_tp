import * as vscode from "vscode";
import { EXT_SETTINGS } from "../common/ext.const";
import { getGlobPatternRegex, WINDOW_PATH } from "../common/regex";
import { ClassNameSuffix, DtoAnnotation, PackageName } from "./config.interface";

export function onConfigChange(event: vscode.ConfigurationChangeEvent) {
  if (event.affectsConfiguration(EXT_SETTINGS.extension)) {
    cfg = vscode.workspace.getConfiguration(EXT_SETTINGS.extension);
  }
}

let cfg: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(EXT_SETTINGS.extension);

export function getJavaConfigPath() {
  const include = toGlobPattern("java", cfg.get(EXT_SETTINGS.includeJavaPaths) as string[]);
  const exclude = toGlobPattern("java", cfg.get(EXT_SETTINGS.excludeJavaPaths) as string[]);
  return { include, exclude };
}
export function getGradleConfigPath() {
  const include = toGlobPattern("gradle", cfg.get(EXT_SETTINGS.includeGradlePaths) as string[]);
  const exclude = toGlobPattern("gradle", cfg.get(EXT_SETTINGS.excludeGradlePaths) as string[]);
  return { include, exclude };
}

export function getClassNameSuffix() {
  return cfg.get(EXT_SETTINGS.classNameSuffix) as ClassNameSuffix;
}

export function getDtoAnnotationConfig() {
  return cfg.get(EXT_SETTINGS.dtoAnnotation) as DtoAnnotation;
}

export function getSubPackageName() {
  return cfg.get(EXT_SETTINGS.subPackageName) as PackageName;
}

export function isSubPackage() {
  return cfg.get(EXT_SETTINGS.isSubPackage) as boolean;
}

function toGlobPattern(ext: string, pathArray: string[]) {
  const qualifiedPathArray: string[] = [];
  for (let path of pathArray) {
    path = path.replace(WINDOW_PATH, "/");
    if (getGlobPatternRegex(ext).test(path)) {
      switch (true) {
        case path.endsWith("/"):
          qualifiedPathArray.push(path + `*.${ext}`);
          break;
        case path.endsWith("/*"):
          qualifiedPathArray.push(path + `*/*.${ext}`);
          break;
        case path.endsWith("/**"):
          qualifiedPathArray.push(path + `/*.${ext}`);
          break;
        default:
          qualifiedPathArray.push(path);
      }
      // *** or **.
    }
  }
  return `{${qualifiedPathArray.join(",")}}`;
}
