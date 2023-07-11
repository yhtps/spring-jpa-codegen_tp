import { EXT_SELECTION } from "../common/ext.const";
import { getDtoAnnotationConfig, getSubPackageName, isSubPackage } from "../config/configUtils";
import { extractPackageDecl } from "./simpleJavaParser";

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

export function getPackageDeclaration(javaContent: string, classType: string) {
  let pkg = extractPackageDecl(javaContent);
  let subPkg = getSubPackageByType(classType);
  if (!isSubPackage()) {
    return pkg;
  } else if (classType === "service") {
    return `${pkg},subPkg`;
  } else {
    return pkg.replace(";", `.${subPkg};`);
  }
}

function getSubPackageByType(classType: string) {
  const ct = EXT_SELECTION.javaClass;
  const subPkg = getSubPackageName();
  switch (classType) {
    case ct.dto:
      return subPkg.dto;
    case ct.service:
      return `${subPkg.service},${subPkg.serviceImpl}`;
    case ct.controller:
      return subPkg.controller;
    case ct.jpaRepo:
      return subPkg.repository;
    case ct.querydslRepo:
      return subPkg.repository;
  }
}
