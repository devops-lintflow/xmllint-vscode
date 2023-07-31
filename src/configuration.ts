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

    public isSupportLanguage(language: string): boolean {
        return this.config["languages"].indexOf(language) >= 0;
    }

    public initialize() {
        this.config = {};
        let settings = vscode.workspace.getConfiguration('javalint');

        if (settings) {
            this.config["languages"] = settings.get("languages", []);
        }

        return this.config;
    }
}