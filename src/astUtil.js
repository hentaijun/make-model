"use strict";
const Syntax = require("./syntax");
const _ = require("lodash");
const matchRegexObject = require("./regexUtil").matchRegexObject;

function walkAst(ast) {
    let result = {child:[]};
    const program = ast.program;
    const programBody = program.body;
    const baseResult = walkAstComponentBase(programBody);
    result = Object.assign({}, result, baseResult);
    return result;
}

function walkAstComponentProptypes(classBody) {
    let result = {
        props:{},
        properties:{}
    };
    _.forEach(classBody, (node, key) => {
        if (node.type == Syntax.ClassProperty && node.key.name == 'propTypes') {
            let propTypesObject = node.value.properties;
            _.forEach(propTypesObject, (child) => {
                let childKey = child.key.name;
                if(childKey == "className" || childKey == "style"){
                    return;
                }

                let childValue = child.leadingComments[0].type == Syntax.CommentBlock ? child.leadingComments[0].value : "";
                const propertiesValue = matchRegexObject(/\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/g, childValue);
                // console.log(propertiesValue);
                result.properties[childKey] = propertiesValue;

            });
        }
    });
    return result;
}

function walkAstComponentBase(programBody) {
    let result = {};
    _.forEach(programBody, (node, key) => {
        if (node.type == Syntax.ExportDefaultDeclaration) {
            const name = node.declaration["id"].name;
            const comments = node.leadingComments[0].type == Syntax.CommentBlock
                ? node.leadingComments[0].value
                : "";
            const baseObj = matchRegexObject(/\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/g, comments);
            const propTypesResult = walkAstComponentProptypes(node.declaration.body.body);
            result = Object.assign({}, result, baseObj, { name: name },propTypesResult);
        }
    });
    return result;
}


module.exports = {
    walkAst: walkAst
};

// /\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/
