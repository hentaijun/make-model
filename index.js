const version = require("./package.json").version;
const parser = require('./src/parser-babylon');
const fs = require("fs");
const path = require("path");
function parse(file){
    const ast = parser(file);
    // console.log(ast);
    try{
        fs.writeFileSync(path.resolve(__dirname,'./test/test.json'),JSON.stringify(ast));
    }catch(e){
        console.error(e);
        process.exit(1);
    }

    process.exit(0);
    
    // /\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/
}

module.exports = {
    version:version,
    parse:parse
};