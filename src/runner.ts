import {spawnSync} from "child_process";
import * as vscode from 'vscode';
import {ConfigManager} from "./configuration";

export function runOnFile() {
    if (vscode.window.activeTextEditor == undefined) {
        return  ""
    }

    let activedoc = vscode.window.activeTextEditor.document;
    let filename = activedoc.fileName;

    if (ConfigManager.getInstance().isSupportLanguage(activedoc.languageId)) {
        return runJavaLint(filename);
    } else {
        return "";
    }
}

export function runJavaLint(filename: string) {
    let config = ConfigManager.getInstance().getConfig();
    let param: string[] = ["-jar"];

    param.push(config["javalintPath"]);
    param.push("--file");
    param.push(filename);

    let output = lint("java", param);

    return output.join('\n');
}

function lint(exec: string, params: string[]) {
    let result = spawnSync(exec, params);
    return [result.stdout, result.stderr];
}
