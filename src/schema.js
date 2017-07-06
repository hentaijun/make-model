// JSON schema types
const ARRAY = 'array';
const BOOLEAN = 'boolean';
// const NUMBER = 'number';
// const NULL = 'null';
// const NUMBER = 'number';
const OBJECT = 'object';
const STRING = 'string';
// const UNDEFINED = 'undefined';

const META_SCHEMA = {
    name: STRING,
    nameSpace: StriSTRINGng,
    comType: STRING,
    useRedux: BOOLEAN,
    props: OBJECT,
    properties: OBJECT,
    description: STRING,
    child: ARRAY
};

module.exports = META_SCHEMA;
