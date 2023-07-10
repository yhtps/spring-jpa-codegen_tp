import { JAVA_FIELD, JAVA_PACKAGE } from "../common/regex";
import { getDtoAnnotationConfig, getSubPackageName, isSubPackage } from "../config/configUtils";
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

let classToExtend: string[]; // 인터페이스일시 여러개
let classToImplement: string[]; // 인터페이스일시 존재하지않음
let methods: string[] = [];

let lImports: string[] = [];
let lClassAnnotations: string[] = [];
export function getDtoAnnotation() {
  const dtoConfig = getDtoAnnotationConfig();
  if (dtoConfig.data) {
    dtoAnnotationMapper("data");
    return { imports: lImports, classAnnotations: lClassAnnotations };
  }
  dtoAnnotationMapper("getter");
  if (dtoConfig.builder) {
    dtoAnnotationMapper("builder");
    dtoAnnotationMapper("allArgsConstructor");
    dtoAnnotationMapper("noArgsConstructor");
  }
  if (dtoConfig.setter) {
    dtoAnnotationMapper("setter");
  }
  if (dtoConfig.allArgsConstructor && !dtoConfig.builder) {
    dtoAnnotationMapper("allArgsConstructor");
  }
  if (dtoConfig.noArgsConstructor && !dtoConfig.builder) {
    dtoAnnotationMapper("noArgsConstructor");
  }
  return { imports: lImports, classAnnotations: lClassAnnotations };
}
function dtoAnnotationMapper(dtoAn: string) {
  lImports.push(`import lombok.${dtoAn};`);
  lClassAnnotations.push(`@${dtoAn[0].toUpperCase()}${dtoAn.slice(1)}`);
}

export function extractEntityPrivateFields(javaContent: string) {
  const fields: { name: string; type: string }[] = [];
  let match = JAVA_FIELD.exec(javaContent);
  while (match) {
    fields.push({ name: match[2], type: match[1] });
    match = JAVA_FIELD.exec(javaContent);
  }
  return fields;
}

export function extractEntityPackageDeclaration(javaContent: string) {
  const match = JAVA_PACKAGE.exec(javaContent);
  return match ? match[1] : "";
}

export function getPackageDeclaration(javaContent: string, classType: string) {
  let pkg = extractEntityPackageDeclaration(javaContent);
  if (!isSubPackage()) {
    return pkg;
  } else {
    let subPkg = extractSubPackageName(classType);
    return pkg.replace(";", `.${subPkg};`);
  }
}

function extractSubPackageName(classType: string) {
  const subPkg = getSubPackageName();
  switch (classType) {
    case "dto":
      return subPkg.dto;
    case "service":
    // return subPkg.service, subPkg.serviceImpl;
    case "controller":
      return subPkg.controller;
    case "jpa repository":
      return subPkg.repository;
    case "querydsl repository":
      return subPkg.repository;
  }
}
