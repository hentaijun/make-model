#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const minimist = require("minimist");
const makemodel = require("../index");

const argv = minimist(process.argv.slice(2), {
    boolean: ["help", "version"],
    string: ["path"],
    alias: {
        help: "h",
        version: "v",
        path: "p"
    },
    unknown: param => {
        if (param.startsWith("-")) {
            console.warn("Ignored unknown option: " + param + "\n");
        } else {
            console.warn(chalk.yellow("请输入参数"));
        }
        return false;
    }
});

if (argv["version"]) {
    console.log(makemodel.version);
    process.exit(0);
}

if (argv["help"]) {
    console.log(
        `Usage: makemde [options]

        -h,--help                    output usage information
        -v,--version                 output the version number
        -p <path>,--path <path>      Input file path and output model.json
    `
    );
    process.exit(argv["help"] ? 0 : 1);
}

if (argv["path"]) {
    let filePath = path.resolve(__dirname, process.cwd(), argv["path"]);
    let outputPath = path.resolve(__dirname, process.cwd(), argv["path"].replace(/(\w+)\.(js|jsx)$/, "model.json"));
    let input;
    try {
        input = fs.readFileSync(filePath, "utf8");
    } catch (e) {
        process.stdout.write("\n");
        console.error("Unable to read file: " + filePath + "\n" + e);
        process.exit(1);
    }
    let model = makemodel.parseComponent(input);
    if (!model) {
        process.exit(1);
    }
    let fileInput = {};
    try{
        fileInput = fs.readFileSync(outputPath);
        fileInput = JSON.parse(fileInput);
    }catch(e){
    }
    let outputModel = Object.assign({},fileInput,model);
    fs.writeFileSync(outputPath, JSON.stringify(outputModel, null, 4));
    console.log(chalk.green(`成功生成model.json文件,路径为${outputPath}`))
    process.exit(0);
}

