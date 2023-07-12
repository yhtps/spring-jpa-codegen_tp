import * as fs from "fs";
import * as vscode from "vscode";
import { VSC_PROPERTIES as VSC } from "../common/ext.const";

export async function getSymbols(file: vscode.Uri) {
  const doc = await getTextDocument(file);
  // vscode.languages.registerDocumentSemanticTokensProvider(provider)
  // vscode.languages.registerDocumentRangeSemanticTokensProvider(provider)
  // vscode.languages.registerWorkspaceSymbolProvider(provider)
  // vscode.languages.registerDocumentSymbolProvider(provider)

  let symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(VSC.commands.symbol, file);
  let dSymbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(VSC.commands.symbol, file);

  for (let symbol of symbols) {
    console.log("Symbol name:", symbol.name);
    console.log("Symbol kind:", symbol.kind);
    console.log("Symbol location:", symbol.location);
    console.log("Symbol location range:", symbol.location.range);
    console.log("Symbol location uri:", symbol.location.uri);
    console.log("Symbol containerName:", symbol.containerName);
    console.log("Symbol tags:", symbol.tags);
  }
  for (let symbol of dSymbols) {
    console.log("Document symbol name:", symbol.name);
    console.log("Document symbol kind:", symbol.kind);
    console.log("Document symbol range:", symbol.range);
    console.log("Document symbol children:", symbol.children);
    console.log("Document symbol detail:", symbol.detail);
    console.log("Document symbol tags:", symbol.tags);
    console.log("Document symbol selectionRange:", symbol.selectionRange);
  }
}

export async function getTextDocument(file: vscode.Uri) {
  return await vscode.workspace.openTextDocument(file);
}

export async function getFiles(cfgPath: { include: string; exclude: string }) {
  return await vscode.workspace.findFiles(cfgPath.include, cfgPath.exclude);
}

export function toFilePaths(files: vscode.Uri): string;
export function toFilePaths(files: vscode.Uri[]): string[];
export function toFilePaths(files: vscode.Uri | vscode.Uri[]): string | string[] {
  return Array.isArray(files)
    ? files.map((file) => file.toString().replace(VSC.fileUri, ""))
    : files.toString().replace(VSC.fileUri, "");
}

export function toFiles(filePaths: string): vscode.Uri;
export function toFiles(filePaths: string[]): vscode.Uri[];
export function toFiles(filePaths: string | string[]): vscode.Uri | vscode.Uri[] {
  return Array.isArray(filePaths) ? filePaths.map((filePath) => vscode.Uri.file(filePath)) : vscode.Uri.file(filePaths);
}

export async function getFilteredFiles(files: vscode.Uri[], searchStr: string, excludeContentRgx?: RegExp[]) {
  const fileContent = await Promise.all(files.map((f) => getFileContent(f, excludeContentRgx)));
  return files.filter((_file, index) => fileContent[index].includes(searchStr));
}

export async function getFileContent(file: vscode.Uri, excludeContentRgx?: RegExp[]) {
  let fileContent = (await getTextDocument(file)).getText().trim();
  excludeContentRgx?.forEach((r) => (fileContent = fileContent.replace(r, "")));
  return fileContent;
}

export function getFileName(file: vscode.Uri, option?: boolean) {
  const fPath = toFilePaths(file);
  if (option) {
    return fPath.substring(fPath.lastIndexOf("/") + 1);
  }
  return fPath.substring(fPath.lastIndexOf("/") + 1, fPath.lastIndexOf("."));
}

export function getDirName(file: vscode.Uri): string {
  const fPath = toFilePaths(file);
  return fPath.substring(0, fPath.lastIndexOf("/"));
}

export async function createFile(filePath: string, fileContent: string) {
  try {
    await fs.promises.access(filePath);
    return false;
  } catch (error) {
    await fs.promises.mkdir(getDirName(toFiles(filePath)), { recursive: true });
    await fs.promises.writeFile(filePath, fileContent);
  }
  return true;
}
