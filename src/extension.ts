import * as vscode from "vscode";
import { EXT_PROPERTIES as EXT, EXT_SELECTION } from "./common/ext.const";
import { getExcludeJavaContentRegex } from "./common/regex";
import { getJavaConfigPath, onConfigChange } from "./config/configUtils";
import { getFileContent, getFileName, getFiles, getFilteredFiles } from "./file/fileUtils";
import { getDtoAnnotation, getPackageDeclaration } from "./file/javaContent";
import { extractClassAnnotations, extractFields } from "./file/simpleJavaParser";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(onConfigChange));
  context.subscriptions.push(vscode.commands.registerCommand(EXT.commands.methods, () => {}));
  context.subscriptions.push(vscode.commands.registerCommand(EXT.commands.classes, codeGenClasses));
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
  // getSymbols(entityPaths[0]);
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
  const items = Object.values(EXT_SELECTION.javaClass);
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
  return await getFilteredFiles(javaFiles, "@Entity", getExcludeJavaContentRegex());
}

async function generateDto(entityPaths: vscode.Uri[], classType: string) {
  const commImports = getDtoAnnotation().imports;
  const commClassAnnotations = getDtoAnnotation().classAnnotations;
  let packagePath: string;
  let fields: string[];
  for (let entityPath of entityPaths) {
    const entityContent = await getFileContent(entityPath, getExcludeJavaContentRegex(true));
    let as = extractClassAnnotations(entityContent);
    console.log(as);

    const entityFields = extractFields(entityContent);
    const dtoPackageDecl = getPackageDeclaration(entityContent, classType);
  }
}

async function getJavaApi() {
  const extension = vscode.extensions.getExtension("redhat.java");
  if (extension) {
    const extensionApi = await extension.exports;
    console.log(extensionApi.status);
  }
}
