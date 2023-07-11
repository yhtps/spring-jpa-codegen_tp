import * as vscode from "vscode";
import { EXT_PROPERTIES as EXT, EXT_NAME } from "../common/ext.const";
import { WINDOW_PATH, getGlobPatternRegex } from "../common/regex";
import { ClassNameSuffix, DtoAnnotation, PackageName } from "./config.interface";

export function onConfigChange(event: vscode.ConfigurationChangeEvent) {
  if (event.affectsConfiguration(EXT_NAME)) {
    cfg = vscode.workspace.getConfiguration(EXT_NAME);
  }
}

let cfg: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(EXT_NAME);

export function getJavaConfigPath() {
  const include = toGlobPattern("java", cfg.get(EXT.settings.includeJavaPaths) as string[]);
  const exclude = toGlobPattern("java", cfg.get(EXT.settings.excludeJavaPaths) as string[]);
  return { include, exclude };
}
export function getGradleConfigPath() {
  const include = toGlobPattern("gradle", cfg.get(EXT.settings.includeGradlePaths) as string[]);
  const exclude = toGlobPattern("gradle", cfg.get(EXT.settings.excludeGradlePaths) as string[]);
  return { include, exclude };
}

export function getClassNameSuffix() {
  return cfg.get(EXT.settings.classNameSuffix) as ClassNameSuffix;
}

export function getDtoAnnotationConfig() {
  return cfg.get(EXT.settings.dtoAnnotation) as DtoAnnotation;
}

export function getSubPackageName() {
  return cfg.get(EXT.settings.subPackageName) as PackageName;
}

export function isSubPackage() {
  return cfg.get(EXT.settings.isSubPackage) as boolean;
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
