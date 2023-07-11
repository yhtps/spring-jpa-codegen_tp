import {
  JAVA_CLASS_DECLARATION,
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

function getClassType(text: string): string {
  const match = text.match(JAVA_PACKAGE);
  if (match) {
    const classType = match[1];
    const className = match[2];

    switch (classType) {
      case "class":
        return "class";
      case "abstract":
        return "abstract class";
      case "enum":
        return "enum";
      case "interface":
        if (text.includes("@FunctionalInterface")) {
          return "functional interface";
        } else {
          return "interface";
        }
      case "record":
        return "record";
      case "sealed":
        return "sealed class";
      case "primitive":
        return "primitive class";
      case "@interface":
        return "annotation interface";
      default:
        return "unknown type";
    }
  } else {
    return "no class declaration found";
  }
}
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

function extractClassDecl(javaContent: string) {
  javaContent = javaContent.replace(JAVA_PACKAGE, "");
  javaContent = javaContent.replace(JAVA_IMPORTS, "");
  const match = JAVA_CLASS_DECLARATION.exec(javaContent) || [];
  return match[0]?.trim() ?? "";
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
