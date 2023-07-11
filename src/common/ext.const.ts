export const VSC_PROPERTIES = {
  commands: { symbol: "vscode.executeDocumentSymbolProvider" },
  fileUri: "file://",
} as const;

export const EXT_NAME = "spring-jpa-codegen";

export const EXT_PROPERTIES = {
  settings: {
    includeJavaPaths: "pathToInclude.javaSrc",
    excludeJavaPaths: "pathToExclude.javaSrc",
    includeGradlePaths: "pathToInclude.gradleBuildScript",
    excludeGradlePaths: "pathToExclude.gradleBuildScript",
    isSubPackage: "package.enableSubPackage",
    subPackageName: "package.subPackageName",
    dtoAnnotation: "annotation.dto",
    classNameSuffix: "suffix.className",
  },
  commands: {
    classes: `${EXT_NAME}.generateSpringJpaCode`,
    methods: `${EXT_NAME}.generateSpringJpaUtilMethod`,
  },
} as const;

export const EXT_SELECTION = {
  javaClass: {
    dto: "dto",
    service: "service",
    controller: "controller",
    jpaRepo: "jpa repository",
    querydslRepo: "querydsl repository",
  },
} as const;
