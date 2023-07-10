export function getGlobPatternRegex(ext: string): RegExp {
  return new RegExp(`(\\*|/|\\.${ext})$`);
}
export const WINDOW_PATH = /\\/g;

export const JAVA_COMMENTS = {
  singleLine: /\/\/.*/g,
  multiLine: /\/\* [\s\S]*?\*\//g,
} as const;

export const JAVA_QUOTED_STR = {
  single: /\'.*?\'/g,
  singleConcat: /\'\'\' [\s\S]*?\'\'\'/g,
  double: /\".*?\"/g,
  doubleConcat: /\"\"\" [\s\S]*?\"\"\"/g,
} as const;

export const QUALIFIED_JAVA_CONTENT: RegExp[] = [
  JAVA_COMMENTS.singleLine,
  JAVA_COMMENTS.multiLine,
  JAVA_QUOTED_STR.single,
  JAVA_QUOTED_STR.double,
  JAVA_QUOTED_STR.singleConcat,
  JAVA_QUOTED_STR.doubleConcat,
];

export const NO_ENTITY_ANNOTATION = /@Entity\w+/g;

export const JAVA_FIELD = /\s+private\s+(\w+)\s+(\w+);/g;

export const JAVA_PACKAGE = /package\s+(.+);/;

export const FILE_NAME_FROM_PATH = /[^/]*$/;
