export function getGlobPatternRegex(ext: string) {
  return new RegExp(`(\\*|/|\\.${ext})$`);
}
export const WINDOW_PATH = /\\/g;

const JAVA_COMMENTS = {
  singleLine: /\/\/.*/g,
  multiLine: /\/\* [\s\S]*?\*\//g,
} as const;
export const JAVA_QUOTED_STR = {
  single: /\'.*?\'/g,
  singleTriple: /\'\'\' [\s\S]*?\'\'\'/g,
  double: /\".*?\"/g,
  doubleTriple: /\"\"\" [\s\S]*?\"\"\"/g,
} as const;
export const QUALIFIED_JAVA_CONTENT = [
  JAVA_COMMENTS.singleLine,
  JAVA_COMMENTS.multiLine,
  JAVA_QUOTED_STR.single,
  JAVA_QUOTED_STR.double,
  JAVA_QUOTED_STR.doubleTriple,
  JAVA_QUOTED_STR.singleTriple,
];
export const QUALIFIED_ENTITY_ANNOTATION = [/@Entity\w+/];
// export const SINGLE_LINE_COMMENTS = /\/\/.*/g;
// export const MULTI_LINE_COMMENTS = /\/\* [\s\S]*?\*\//g;
// export const SINGLE_QUOTED_STRING = /\'.*@.*\'/g;
// export const QUOTED_STRING_AT = /\"[^\\\"]*@[^\\\"]*\"/g;

export const JAVA_FIELD = /\s+private\s+(\w+)\s+(\w+);/g;

export const JAVA_PACKAGE = /package\s+(.+);/;

const packageRegex = /package\s+([\w.]+);/;
