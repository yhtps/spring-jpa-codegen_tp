import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export async function getFileText(files: vscode.Uri[]) {
  for (const file of files) {
    const document = await vscode.workspace.openTextDocument(file);
    console.log(document.getText());

    let symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
      "vscode.executeDocumentSymbolProvider",
      document.uri
    );
    let dSymbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
      "vscode.executeDocumentSymbolProvider",
      document.uri
    );
  }
}
export async function getFiles(cfgPath: { include: string; exclude: string }) {
  return await vscode.workspace.findFiles(cfgPath.include, cfgPath.exclude);
}

export function toFilePaths(files: vscode.Uri[]): string[] {
  return files.map((file) => file.fsPath);
}

export function toFiles(filePaths: string[]): vscode.Uri[] {
  return filePaths.map((filePath) => vscode.Uri.file(filePath));
}

export async function getFilteredFilePaths(filePaths: string[], searchStr: string, excludeContentRgx?: RegExp[]) {
  const qFContents = await Promise.all(filePaths.map((f) => getFileContent(f, excludeContentRgx)));
  return filePaths.filter((_file, index) => qFContents[index].includes(searchStr));
}

export async function getFileContent(filePath: string, excludeContentRgx?: RegExp[]) {
  let fileContent = (await fs.promises.readFile(filePath, "utf8")).toString();
  return excludeContentRgx ? excludeContentRgx.map((r) => (fileContent = fileContent.replace(r, ""))).join("") : fileContent;
}

export function getFileName(filePath: string) {
  return path.basename(filePath);
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
