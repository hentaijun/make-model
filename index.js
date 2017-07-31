const version = require("./package.json").version;
const parser = require('./src/parser-babylon');
const fs = require("fs");
const path = require("path");
const astUtil = require("./src/astUtil");
function parseComponent(file) {
    const ast = parser(file);
    let model;
    // fs.writeFileSync(path.resolve(__dirname,"test","test.json"),JSON.stringify(ast,null,4));
    try {
        model = astUtil.walkAst(ast);
        return model;
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}


function parseFunction(file) {
    // file = fs.readFileSync(path.resolve(__dirname,"test","jumpToFxHome.js"), "utf8");
    const ast = parser(file);
    let functionModel;

    model = astUtil.walkAstForFunction(ast);
    //fs.writeFileSync(path.resolve(__dirname,"test","function-model.json"),JSON.stringify(model,null,4));
    return model;
}
module.exports = {
    version: version,
    parseComponent: parseComponent,
    parseFunction: parseFunction
};
