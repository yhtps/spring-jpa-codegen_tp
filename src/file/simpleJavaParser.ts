import {
  JAVA_CLASS_TYPE,
  JAVA_CLAUSE,
  JAVA_FIELD,
  JAVA_IMPORTS,
  JAVA_PACKAGE,
  SINGLE_LINE_ANNOTATION,
  SPLITTER,
} from "../common/regex";

export interface JavaClass {
  package: string;
  imports: string[];
  annotations?: string[];
  classDeclaration: string;
  extends?: string[];
  implements?: string[];
  fields?: string[];
  methods?: string[];
}
export interface JavaClassDecl {
  annotations?: string[];
  type: string;
  extends?: string[];
  implements?: string[];
}

export const javaClassTemplate: string = `
package packagePath;

imports

annotations
public classDeclaration extends implements {

    fields

    methods

}
`;

export const javaInterfaceTemplate: string = `
package packagePath;

imports

annotations
public classDeclaration extends {

    fields

    methods

}
`;

export function extractJavaClass(javaContent: string) {
  javaContent = javaContent;
  let javaClass: JavaClass;
  javaClass = {
    package: extractPackageDecl(javaContent),
    imports: extractImports(javaContent),
    classDeclaration: extractClassDecl(javaContent),
  };

  return javaClass;
}
export function extractPackageDecl(javaContent: string) {
  const match = JAVA_PACKAGE.exec(javaContent) || [];
  return match[1];
}
export function extractImports(javaContent: string): string[] {
  const matches = javaContent.match(JAVA_IMPORTS) || [];
  return matches.map((match) => match.replace(JAVA_IMPORTS, "$1"));
}

export function extractClassDecl(javaContent: string) {
  javaContent = javaContent.replace(JAVA_PACKAGE, "");
  javaContent = javaContent.replace(JAVA_IMPORTS, "");
  const match = JAVA_CLAUSE.classDeclaration.exec(javaContent) || [];
  if (match[0]) {
    let javaClass: JavaClassDecl;
    javaClass = {
      type: "",
      annotations: [],
      extends: [],
      implements: [],
    };
  }
  return match[0] ?? "";
}
export function extractClassAnnotations(javaContent: string) {
  const classDeclaration = extractClassDecl(javaContent);
  const matches = classDeclaration.match(SINGLE_LINE_ANNOTATION) || [];
  return matches ?? [];
}
export function extractExtends(javaContent: string) {
  let classDeclaration = extractClassDecl(javaContent);
  classDeclaration = classDeclaration.replace(SINGLE_LINE_ANNOTATION, "");
}
export function extractImplements(javaContent: string) {
  let classDeclaration = extractClassDecl(javaContent);
  classDeclaration = classDeclaration.replace(SINGLE_LINE_ANNOTATION, "");
}
export function extractFields(javaContent: string) {
  const matches = javaContent.match(JAVA_FIELD) || [];
  const fields = matches.map((match) => {
    const [, , type, name] = match.split(SPLITTER.space);
    return { name, type };
  });

  return fields;
}

export function extractMethods(javaContent: string) {}

function getClassType(classDeclaration: string): string {
  for (const [key, value] of Object.entries(JAVA_CLASS_TYPE)) {
    if (value.test(classDeclaration)) {
      return String(key);
    }
  }
  return "class";
}
