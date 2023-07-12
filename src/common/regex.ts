export function getGlobPatternRegex(ext: string): RegExp {
  return new RegExp(`(\\*|/|\\.${ext})$`);
}
export const WINDOW_PATH = /\\/g;

export const SPLITTER = { space: /\s+/ } as const;

export const QUALIFIED_JAVA_CONTENT = {
  comments: {
    singleLine: /\/\/.*/g,
    multiLine: /\/\*[\s\S]*?\*\//g,
  },
  quotedString: {
    single: /\'.*?\'/g,
    singleConcat: /\'\'\'[\s\S]*?\'\'\'/g,
    double: /\".*?\"/g,
    doubleConcat: /\"\"\"[\s\S]*?\"\"\"/g,
  },
  noEntityAnnotation: /@Entity\w+/g,
} as const;

export function getExcludeJavaContentRegex(option?: boolean) {
  const regex = [
    ...Object.values(QUALIFIED_JAVA_CONTENT.comments),
    ...Object.values(QUALIFIED_JAVA_CONTENT.quotedString),
    ...[QUALIFIED_JAVA_CONTENT.noEntityAnnotation],
  ];
  if (option) {
    regex.pop();
  }
  return regex;
}
export const JAVA_FIELD = /\s*private\s+(\w+)\s+(\w+);/g;

export const JAVA_PACKAGE = /\s*package\s+(.+);/;

export const JAVA_IMPORTS = /\s*import\s+([a-zA-Z0-9_.]+);/g;

export const SINGLE_LINE_ANNOTATION = /@.*/g;

export const JAVA_EXTENDS = /\bextends\b[\s\S]*/g;

export const JAVA_IMPLEMENTS = /\bimplements\b[\s\S]*/g;

export const JAVA_CLAUSE = {
  classDeclaration: /[\s\S]*?(?=\{)/g,
  inheritance: {
    extends: /\bextends\b[\s\S]*/g,
    implements: /\bimplements\b[\s\S]*/g,
  },
} as const;

export const JAVA_CLASS_TYPE = {
  abstractClass: /\babstract\s+class \b /,
  sealedClass: /\bsealed\s+class\b/,
  annotationInterface: /\b@interface\b/,
  interface: /\binterface\b/,
  enum: /\benum\b/,
  record: /\brecord\b/,
} as const;
