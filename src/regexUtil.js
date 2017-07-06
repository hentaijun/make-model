function matchRegexObject(regex, str) {
    let m;
    let result = {};
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        result[m[1]] = m[2];
    }
    return result;
}

module.exports = {
    matchRegexObject:matchRegexObject
};
