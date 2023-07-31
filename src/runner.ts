import {spawnSync} from "child_process";
import {XMLParser} from "fast-xml-parser";
import * as vscode from 'vscode';
import {ConfigManager} from "./configuration";

export function runXmlLint() {
    if (vscode.window.activeTextEditor == undefined) {
        return  ""
    }

    let activedoc = vscode.window.activeTextEditor.document;
    let filetext = activedoc.getText();

    if (ConfigManager.getInstance().isSupportLanguage(activedoc.languageId)) {
        return runHelper(filetext);
    } else {
        return "";
    }
}

function runHelper(filetext: string) {
    const options = {
        ignoreAttributes : false
    };

    const parser = new XMLParser(options);
    let buf = parser.parse(filetext);

    let result = checkIntent(buf)

    return result.join('\n');
}

function checkIntent(data: any) {
    // <action android:name="android.intent.action.MAIN" />
    // TODO

    return []
}
