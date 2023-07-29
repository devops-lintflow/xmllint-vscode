'use strict';

import * as vscode from 'vscode';
import {platform} from 'os';
import {isNull} from 'lodash';
import {existsSync} from 'fs';

export class ConfigManager {

    private static _instance: ConfigManager = new ConfigManager();

    private config: { [key: string]: any } = {};

    constructor() {
        if (ConfigManager._instance) {
            throw new Error("Error: Instantiation failed: Use ConfigManager.getInstance() instead of new.");
        }

        ConfigManager._instance = this;
    }

    public static getInstance(): ConfigManager {
        return ConfigManager._instance;
    }

    public getConfig(): { [key: string]: any } {
        return this.config;
    }

    private static findJavalintPath(settings: vscode.WorkspaceConfiguration): string {
        let javalintPath = settings.get('javalintPath', null);

        if (isNull(javalintPath)) {
            let p = platform();

            if (p === 'win32') {
                // TODO: add win32 and win64 javalint path
            } else if (p === 'linux' || p === 'darwin') {
                let attempts = ['/usr/local/lib/javalint.jar'];
                for (let index = 0; index < attempts.length; index++) {
                    if (existsSync(attempts[index])) {
                        javalintPath = attempts[index];
                        break;
                    }
                }
            }
        }

        return javalintPath;
    }

    public isSupportLanguage(language: string): boolean {
        return this.config["languages"].indexOf(language) >= 0;
    }

    public initialize() {
        this.config = {};
        let settings = vscode.workspace.getConfiguration('javalint');

        if (settings) {
            var javalintPath = ConfigManager.findJavalintPath(settings);

            if (!existsSync(javalintPath)) {
                vscode.window.showErrorMessage('Javalint: Could not find javalint executable');
            }

            this.config['javalintPath'] = javalintPath;
            this.config["languages"] = settings.get("languages", []);
        }

        return this.config;
    }
}