const version = require("./package.json").version;
const parser = require('./src/parser-babylon');
const fs = require("fs");
function parse(file){
    const ast = parser(file);
    console.log(ast);
    fs.writeFileSync('./test/test.json',JSON.stringify(ast));
    // /\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/
}

module.exports = {
    version:version,
    parse:parse
};