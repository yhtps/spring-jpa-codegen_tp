import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { VSC_COMMANDS } from "../common/ext.const";

export async function getDocSymbols(file: vscode.Uri) {
  const doc = await getDoc(file);
  let symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(VSC_COMMANDS.symbol, doc.uri);
  let dSymbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(VSC_COMMANDS.symbol, doc.uri);

  for (let symbol of dSymbols) {
    console.log(symbol.name); // 기호의 이름
    console.log(symbol.kind); // 기호의 종류
    console.log(symbol.children); // 기호의 위치
    console.log(symbol.detail); // 기호의 컨테이너 이름
  }
}

export async function getDoc(file: vscode.Uri) {
  return await vscode.workspace.openTextDocument(file);
}

export async function getFiles(cfgPath: { include: string; exclude: string }) {
  return await vscode.workspace.findFiles(cfgPath.include, cfgPath.exclude);
}

export function toFilePaths(files: vscode.Uri): string;
export function toFilePaths(files: vscode.Uri[]): string[];
export function toFilePaths(files: vscode.Uri | vscode.Uri[]): string | string[] {
  return Array.isArray(files)
    ? files.map((file) => file.toString().replace("file://", ""))
    : files.toString().replace("file://", "");
}

export function toFiles(filePaths: string): vscode.Uri;
export function toFiles(filePaths: string[]): vscode.Uri[];
export function toFiles(filePaths: string | string[]): vscode.Uri | vscode.Uri[] {
  return Array.isArray(filePaths) ? filePaths.map((filePath) => vscode.Uri.file(filePath)) : vscode.Uri.file(filePaths);
}

export async function getFilteredFilePaths(files: vscode.Uri[], searchStr: string, excludeContentRgx?: RegExp[]) {
  const fileContent = await Promise.all(files.map((f) => getFileContent(f, excludeContentRgx)));
  return files.filter((_file, index) => fileContent[index].includes(searchStr));
}

export async function getFileContent(file: vscode.Uri, excludeContentRgx?: RegExp[]) {
  // let fileContent = (await fs.promises.readFile(toFilePaths(filePath), "utf8")).toString();
  let fileContent = (await getDoc(file)).getText();
  excludeContentRgx?.forEach((r) => (fileContent = fileContent.replace(r, "")));
  return fileContent;
}

export function getFileName(file: vscode.Uri) {
  return path.parse(toFilePaths(file)).name;
}

export async function createFile(filePath: string, fileContent: string) {
  try {
    await fs.promises.access(filePath);
    return false;
  } catch (error) {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, fileContent);
  }
  return true;
}
