"use strict";
const Syntax = require("./syntax");
const _ = require("lodash");
const chalk = require("chalk");
const { matchRegexObject, matchRegexObjectForFunction } = require("./regexUtil");

function walkAst(ast) {
    let result = {};
    const program = ast.program;
    const programBody = program.body;
    const baseResult = walkAstComponentBase(programBody);
    result = Object.assign({}, result, baseResult);
    return result;
}

function walkAstComponentProptypes(classBody) {
    let result = {
        properties: {}
    };
    _.forEach(classBody, (node, key) => {
        if (node.type == Syntax.ClassProperty && node.key.name == 'propTypes') {
            let propTypesObject = node.value.properties;
            _.forEach(propTypesObject, (child) => {
                let childKey = child.key.name;
                if (childKey == "className" || childKey == "style" || childKey == "children") {
                    return;
                }
                if (child.leadingComments) {
                    let childValue = child.leadingComments[0].type == Syntax.CommentBlock ? child.leadingComments[0].value : "";
                    const propertiesValue = matchRegexObject(/\*\s*(?:@(\w+))?\s*([\u4e00-\u9fa5|\w]+)/g, childValue);
                    result.properties[childKey] = propertiesValue;
                } else {
                    console.log(chalk.yellow(`warn:${childKey}属性未配置信息`));
                }
            });
        }
    });

    return result;
}

function walkAstComponentProps(classBody) {
    let result = {
        props: {}
    };
    _.forEach(classBody, (node, key) => {
        if (node.type == Syntax.ClassProperty && node.key.name == 'defaultProps') {
            let propsObject = node.value.properties;
            _.forEach(propsObject, (child) => {
                let childKey = child.key.name;
                if (childKey == "className" || childKey == "style" || childKey == "children") {
                    return;
                }
                let childValue;
                if (child.value.type == Syntax.FunctionExpression) {
                    childValue = {};
                } else if (child.value.type == Syntax.ArrayExpression) {
                    childValue = [];
                    let elementArray = child.value.elements;
                    _.forEach(elementArray, (elem) => {
                        childValue.push(elem.value);
                    });
                } else {
                    childValue = child.value.value;
                }
                result.props[childKey] = childValue;
            });
        }
    });
    return result;
}

function walkAstComponentBase(programBody) {
    let result = {};
    let isRequireKey = ["namespace", "comType"]
    _.forEach(programBody, (node, key) => {
        if (node.type == Syntax.ExportDefaultDeclaration) {
            if (node.declaration.type !== Syntax.ClassDeclaration) {
                return;
            }
            const name = node.declaration["id"].name;
            let leadingComments;
            if(Array.isArray(node.declaration.decorators) && node.declaration.decorators[0].type == Syntax.Decorator){
                leadingComments = node.declaration.decorators[0].leadingComments;
            }else{
                leadingComments = node.leadingComments
            }
            if (leadingComments) {
                const comments = leadingComments[0].type == Syntax.CommentBlock
                    ? leadingComments[0].value
                    : "";
                const baseObj = matchRegexObject(/\*\s*(?:@(\w+))?\s*([\u4e00-\u9fa5|\w]+)/g, comments,true);
                const classBody = node.declaration.body.body;
                const propTypesResult = walkAstComponentProptypes(classBody);
                const propsResult = walkAstComponentProps(classBody);
                result = Object.assign({}, result, baseObj, { name: name }, propTypesResult, propsResult);
            } else {
                console.error(chalk.red(`${name}组件基本信息未填写`));
                process.exit(1);
            }
        }
    });
    let checkRes = true;
    for (let i = 0; i < isRequireKey.length; i++) {
        let requireKey = isRequireKey[i];
        if (!result[requireKey]) {
            console.error(chalk.red(`${requireKey}是组件基本信息配置必填项`));
            checkRes = false;
        }
    }
    if (!checkRes) {
        process.exit(1);
    }
    return result;
}

function walkAstForFunction(ast) {
    let result = {};
    const program = ast.program;
    const programBody = program.body;
    result = walkAstFunctionBase(programBody);
    return result;
}

function walkAstFunctionBase(body) {
    let resultArray = [];
    let result = {};
    _.forEach(body, (node) => {
        if (node.type === Syntax.ExportDefaultDeclaration || node.type === Syntax.FunctionDeclaration || node.type === Syntax.ExportNamedDeclaration) {
            if (node.leadingComments) {
                const name = node.declaration ? node.declaration["id"] && node.declaration["id"].name : node["id"] && node["id"].name;
                const comments = node.leadingComments[0].type == Syntax.CommentBlock
                    ? node.leadingComments[0].value
                    : "";
                const baseObj = matchRegexObjectForFunction(/\*\s*(?:@(\w+))?\s*(?:\{(\w+)\})?\s*([\u4e00-\u9fa5|\w]+)\s*([\u4e00-\u9fa5|\w]+)?/g, comments, true);
                result = Object.assign({}, result, { name: name },baseObj);
                resultArray.push(result);
            }
        }
    });
    return resultArray;
}

module.exports = {
    walkAst: walkAst,
    walkAstForFunction: walkAstForFunction
};

// /\*\s*@(\w+)\s*([\u4e00-\u9fa5|\w]+)/
