const version = require("./package.json").version;
const parser = require('./src/parser-babylon');
const fs = require("fs");
const path = require("path");
const astUtil = require("./src/astUtil");
function parse(file){
    const ast = parser(file);
    let model;
    // console.log(ast);
    try{
        model = astUtil.walkAst(ast);
        return model;
    }catch(e){
        console.error(e);
        process.exit(1);
    }


    // /\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/
}

module.exports = {
    version:version,
    parse:parse
};
