function matchRegexObject(regex, str) {
    let m;
    let result = {};
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        let value = m[2];
        if(typeof value == 'string' && value.match(/^\[([\w+\W]+,?)*\]$/)){
            value = value.slice(1,value.length-1).split(",");
        }
        result[m[1]] = value;
    }
    return result;
}

module.exports = {
    matchRegexObject:matchRegexObject
};
