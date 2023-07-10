import * as vscode from "vscode";
import { CLASS_SELECTION, EXT_COMMANDS } from "./common/ext.const";
import { QUALIFIED_ENTITY_ANNOTATION, QUALIFIED_JAVA_CONTENT } from "./common/regex";
import { getJavaConfigPath, onConfigChange } from "./config/configUtils";
import { getFileContent, getFileName, getFiles, getFilteredFilePaths, toFilePaths } from "./file/fileUtils";
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

  const entityPaths = await selectEntityPaths(classType);
  if (!entityPaths) {
    return;
  }

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
async function selectEntityPaths(classType: string) {
  const entityPaths = await getEntityPaths();
  const items = entityPaths.map((path) => ({
    label: getFileName(path).replace(".java", ""),
    path,
  }));
  let selectedItem = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: `generate ${classType} from which entities?`,
  });
  return selectedItem?.map((i) => i.path);
}

async function getEntityPaths() {
  const javaFiles = await getFiles(getJavaConfigPath());
  const qRegex = [...QUALIFIED_JAVA_CONTENT, ...QUALIFIED_ENTITY_ANNOTATION];
  return await getFilteredFilePaths(toFilePaths(javaFiles), "@Entity", qRegex);
}

async function generateDto(entityPaths: string[], classType: string) {
  const commImports = getDtoAnnotation().imports;
  const commClassAnnotations = getDtoAnnotation().classAnnotations;
  console.log(commClassAnnotations, commImports);

  let packagePath: string;
  let fields: string[];
  for (let entityPath of entityPaths) {
    const entityContent = await getFileContent(entityPath, QUALIFIED_JAVA_CONTENT);
    const entityFields = extractEntityPrivateFields(entityContent);
    const dtoPackageDecl = getPackageDeclaration(entityContent, classType);
    console.log(dtoPackageDecl, entityFields);
  }
}
