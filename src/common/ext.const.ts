export const EXT_SETTINGS = {
  extension: "spring-jpa-codegen",
  includeJavaPaths: "pathToInclude.javaSrc",
  excludeJavaPaths: "pathToExclude.javaSrc",
  includeGradlePaths: "pathToInclude.gradleBuildScript",
  excludeGradlePaths: "pathToExclude.gradleBuildScript",
  isSubPackage: "package.enableSubPackage",
  subPackageName: "package.subPackageName",
  dtoAnnotation: "annotation.dto",
  classNameSuffix: "suffix.className",
} as const;

export const EXT_COMMANDS = {
  classes: `${EXT_SETTINGS.extension}.generateSpringJpaCode`,
  methods: `${EXT_SETTINGS.extension}.generateSpringJpaUtilMethod`,
} as const;
export const VSC_COMMANDS = {
  symbol: "vscode.executeDocumentSymbolProvider",
} as const;

export const CLASS_SELECTION = ["dto", "service", "controller", "jpa repository", "querydsl repository"];
