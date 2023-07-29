'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as an from './runner';
import {Lint} from './lint';
import {ConfigManager} from './configuration';

let diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('javalint');
let outputChannel: vscode.OutputChannel;
let timer: NodeJS.Timer;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('JavaLint');
    // outputChannel.appendLine('JavaLint is running.');
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "javalint" is now active!');

    loadConfigure();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let single = vscode.commands.registerCommand('javalint.runAnalysis', runAnalysis);
    context.subscriptions.push(single);

    vscode.workspace.onDidChangeConfiguration((()=>loadConfigure()).bind(this));
}

function runAnalysis(): Promise<void> {
    if (vscode.window.activeTextEditor == undefined) {
        return Promise.reject("no edit opened");
    }

    outputChannel.show();
    outputChannel.clear();

    let start = 'JavaLint started: ' + new Date().toString();
    outputChannel.appendLine(start);

    let result = an.runOnFile();
    outputChannel.appendLine(result);

    let end = 'JavaLint ended: ' + new Date().toString();
    outputChannel.appendLine(end);

    // vscode.window.showInformationMessage(edit.document.uri.fsPath)

    return Promise.resolve()
}

// this method is called when your extension is deactivated
export function deactivate() {
    clearTimeout(timer)
    vscode.window.showInformationMessage("Javalint deactivated")
}

function doLint() {
    if (vscode.window.activeTextEditor) {
        let language = vscode.window.activeTextEditor.document.languageId
        if (ConfigManager.getInstance().isSupportLanguage(language)) {
            Lint(diagnosticCollection);
        }
    }

    clearTimeout(timer)
}

function startLint() {
    timer = global.setTimeout(doLint, 500);
}

function loadConfigure() {
    ConfigManager.getInstance().initialize();

    startLint();

    vscode.window.onDidChangeActiveTextEditor((() => startLint()).bind(this));
    vscode.workspace.onDidSaveTextDocument((() => startLint()).bind(this));
}
