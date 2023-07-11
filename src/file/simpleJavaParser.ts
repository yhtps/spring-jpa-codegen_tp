import { JAVA_CLASS_ANNOTATION, JAVA_CLASS_DECLARATION, JAVA_FIELD, JAVA_IMPORTS, JAVA_PACKAGE, SPLITTER } from "../common/regex";

function getClassType(text: string): string {
  // 클래스 선언 부를 찾는 정규 표현식
  const classRegex = /(\w+)\s+([a-zA-Z0-9_]+)/;

  // 전체 텍스트에 정규 표현식을 적용하여 클래스 선언 부를 추출함
  const match = classRegex.exec(text);
  if (match) {
    // 첫 번째 그룹은 클래스 유형을 나타냄
    const classType = match[1];
    // 두 번째 그룹은 클래스 이름을 나타냄
    const className = match[2];

    // 클래스 유형에 따라서 적절한 문자열로 반환함
    switch (classType) {
      case "class":
        return "class";
      case "abstract":
        return "abstract class";
      case "enum":
        return "enum";
      case "interface":
        // 인터페이스일 경우, 함수형 인터페이스인지 확인함
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
    // 클래스 선언 부를 찾지 못했을 경우
    return "no class declaration found";
  }
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
  let classDeclaration = extractClassDecl(javaContent);
  console.log(classDeclaration);

  const matches = classDeclaration.match(JAVA_CLASS_ANNOTATION) || [];
  return matches ?? [];
}
export function extractExtends(javaContent: string) {
  extractClassDecl(javaContent);
}
export function extractImplements(javaContent: string) {
  extractClassDecl(javaContent);
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
