# make-model

根据类jsdoc的形式生成对应的model.json

##命令行用法:
```
    npm install make-model -g
    makemodel -p <filepath>
```

## 命令行参数
```
    -h,--help  帮助
    -v --version 版本
    -p,--path <path> 文件路径
```

###方法库同步方法
```
npm install make-model --save

import {parseFunction} from 'make-model';  //ES6
or
const parseFunction = require('make-model').parseFunction; //ES5 
```

