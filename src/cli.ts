#!/usr/bin/env node
import fs from 'fs';
import path from 'path'
import chalk from 'chalk';
import IntlGen from './intl-gen';
import { Command } from "commander"
import { pathToFileURL } from 'url';
import { version } from '../package.json'

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

const logger = {
    error(...args: unknown[]) {
        console.log(chalk.red(...args))
    },
    warn(...args: unknown[]) {
        console.log(chalk.yellow(...args))
    },
    info(...args: unknown[]) {
        console.log(chalk.cyan(...args))
    },
    success(...args: unknown[]) {
        console.log(chalk.green(...args))
    },
}

async function main() {
    const program = new Command()

    program.version(version);
    program.option('-c, --config <string>');
    program.parse();

    const options = program.opts();
    const extensions = ['.js', '.ts', '.cjs', '.mjs']

    let filename = options.config ?? 'intl.config';
    const hasValidExtension = extensions.some(ext => filename.endsWith(ext));

    let configPath = '';
    if (hasValidExtension) {
        const fullPath = path.resolve(process.cwd(), filename);
        if (fs.existsSync(fullPath)) {
            configPath = fullPath;
        }
    } else {
        for (const ext of extensions) {
            const fullPath = path.resolve(process.cwd(), filename + ext);
            if (fs.existsSync(fullPath)) {
                configPath = fullPath;
                break;
            }
        }
    }

    if (!configPath) {
        logger.error("Config file not found.");
        process.exit(1);
    }

    try {
        let sources: any;

        if (configPath.endsWith('.mjs')) {
            const dynamicImport = new Function("filePath", "return import(filePath)");
            sources = (await dynamicImport(pathToFileURL(configPath).href));
        } else if (configPath.endsWith('.ts')) {
            const tsNode = require('ts-node');
            tsNode.register({ transpileOnly: true });
            sources = require(configPath);
        } else {
            sources = require(configPath);
        }

        const intl = new IntlGen(sources.default ?? sources.config);
        await intl.run();
    } catch (err) {
        logger.error("Failed to load config file:", err);
    }
}

main()