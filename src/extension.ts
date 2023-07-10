import * as vscode from "vscode";
import { CLASS_SELECTION, EXT_COMMANDS } from "./common/ext.const";
import { NO_ENTITY_ANNOTATION, QUALIFIED_JAVA_CONTENT } from "./common/regex";
import { getJavaConfigPath, onConfigChange } from "./config/configUtils";
import { getDocSymbols, getFileContent, getFileName, getFiles, getFilteredFilePaths } from "./file/fileUtils";
import { extractEntityPrivateFields, getDtoAnnotation, getPackageDeclaration } from "./file/javaContent";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(onConfigChange));
  context.subscriptions.push(vscode.commands.registerCommand(EXT_COMMANDS.methods, () => {}));
  context.subscriptions.push(vscode.commands.registerCommand(EXT_COMMANDS.classes, codeGenClasses));
}

export function deactivate() {}

async function codeGenClasses() {
  const classType = await selectClassType();

  if (!classType) {
    return;
  }

  const entityPaths = await selectEntityPaths();
  if (!entityPaths) {
    return;
  }
  getDocSymbols(entityPaths[0]);
  switch (classType) {
    case "dto":
      generateDto(entityPaths, classType);
      break;
    case "service":
      // service에 대한 처리를 합니다.
      break;
    case "controller":
      // controller에 대한 처리를 합니다.
      break;
    case "jpa repository":
      // jpa repository에 대한 처리를 합니다.
      break;
    case "querydsl repository":
      // querydsl repository에 대한 처리를 합니다.
      break;
    default:
      break;
  }
}

async function selectClassType() {
  const items = CLASS_SELECTION;
  let selectedItem = await vscode.window.showQuickPick(items, {
    canPickMany: false,
    title: "What type of class do you want to create?",
  });
  return selectedItem;
}
async function selectEntityPaths() {
  const entityPaths = await getEntityPaths();

  const items = entityPaths.map((file) => ({
    label: getFileName(file),
    file,
  }));
  let selectedItem = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: `generate classes from which entities?`,
  });
  return selectedItem?.map((i) => i.file);
}

async function getEntityPaths() {
  const javaFiles = await getFiles(getJavaConfigPath());
  const qRegex = [...QUALIFIED_JAVA_CONTENT, ...[NO_ENTITY_ANNOTATION]];
  return await getFilteredFilePaths(javaFiles, "@Entity", qRegex);
}

async function generateDto(entityPaths: vscode.Uri[], classType: string) {
  const commImports = getDtoAnnotation().imports;
  const commClassAnnotations = getDtoAnnotation().classAnnotations;
  let packagePath: string;
  let fields: string[];
  for (let entityPath of entityPaths) {
    const entityContent = await getFileContent(entityPath, QUALIFIED_JAVA_CONTENT);
    const entityFields = extractEntityPrivateFields(entityContent);
    const dtoPackageDecl = getPackageDeclaration(entityContent, classType);
    // console.log(dtoPackageDecl, entityFields);
  }
}
