function matchRegexObject(regex, str) {
    let m;
    let result = {};
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        let value = m[2];
        let key = m[1];
        if (typeof value == 'string' && value.match(/^\[([\w+\W]+,?)*\]$/)) {
            value = value.slice(1, value.length - 1).split(",");
        }

        if (!key) {
            key == 'desc';
            result[key] = result[key] + value;
        } else {
            result[key] = value;
        }
    }
    return result;
}

function matchRegexObjectForFunction(regex, str) {
    let m;
    let result = {
        description:"",
        param:[]
    };
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // let value = m[2];
        let key = m[1];
        if (typeof value == 'string' && value.match(/^\[([\w+\W]+,?)*\]$/)) {
            value = value.slice(1, value.length - 1).split(",");
        }

        if (!key) {
            if(!m[3]){
                break;
            }
            result["description"] = result["description"] + m[3];
        } else if (key === "param") {
            let typeArray = ["string","array","function","object","number","boolean"];
            if(typeArray.indexOf(m[2]) === -1){
                throw Error(`param 类型必须配置类型，类型为"string","array","function","object","number","boolean"`)
            }
            const paramArray = result[key];
            paramArray.push({ name: m[3],type:m[2],description:m[4]});
            result[key] = paramArray;
        }else{
             result[key] = m[3];
        }

    }
    return result;
}

module.exports = {
    matchRegexObject: matchRegexObject,
    matchRegexObjectForFunction:matchRegexObjectForFunction
};
