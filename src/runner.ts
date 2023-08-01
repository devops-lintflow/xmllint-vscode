import {XMLParser, XMLValidator} from "fast-xml-parser";
import * as vscode from 'vscode';
import {ConfigManager} from "./configuration";

export function runXmlLint() {
    if (vscode.window.activeTextEditor == undefined) {
        return [];
    }

    let activedoc = vscode.window.activeTextEditor.document;
    let filename = activedoc.fileName;
    let filetext = activedoc.getText();

    if (ConfigManager.getInstance().isSupportLanguage(activedoc.languageId)) {
        return runHelper(filename, filetext);
    } else {
        return [];
    }
}

function runHelper(filename: string, filetext: string) {
    const buf = XMLValidator.validate(filetext, {
        allowBooleanAttributes: true
    });

    let result = [];

    result.push(checkIntent(filename, buf));

    if (buf !== true) {
        result.push(`${filename}:${buf['err']['line']}:Error:${buf['err']['msg']}`);
    }

    return result;
}

function checkIntent(xmlname: string, xmldata: any) {
    let msg = 'The name of a custom intent can NOT begin with android.intent.action'

    return `${xmlname}:1:Warn:${msg}`;
}
