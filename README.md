# webui-jason

## 文件命名规范

一律使用小写字母，单词间用`-`连接，名词一律使用单数形式。

正确的命名：`path-name`

错误的命名：`PathName`, `pathName`, `path_name`, `path-names`

### 目录结构

- `bin - 命令脚本`
- `dist - 构建目标`
- `gulp - gulp task文件`
- `src - 源文件`
- `webpack.* webpack配置文件`
- `-- src/css - css文件`
- `---- src/css/main - css主文件`
- `---- src/css/vendor - less预编译文件`
- `---- src/html/ejs - ejs模板文件`
- `---- src/html/include - layout文件`
- `---- src/html/loading - loading文件`
- `---- src/html/section - module文件`
- `-- src/image - 图片`
- `-- src/html - html静态文件`
- `-- src/static - 静态数据文件`
- `-- src/util - 工具库文件`
- `-- src/vendor - 自定义的库文件`
- `-- src/index.js - 入口文件`
- `-- src/preboot.js - 预加载module`


## 如何使用该项目

1. 进入该项目执行`npm install`
2. 启动项目执行`npm start`
3. 打包项目`npm run build`

### 优化图片

- 进行图片优化执行`gulp imagemin`

### github hook
![github hook](https://github.com/json-HB/marina/blob/master/assert/githubHook.png)
![hook result](https://github.com/json-HB/marina/blob/master/assert/result.jpg)

### 部署服务器
> nodeApi 文件

![nodeApi](https://github.com/json-HB/marina/blob/master/assert/nodeApi.jpg)

> shell 脚本执行构建

![shell](https://github.com/json-HB/marina/blob/master/assert/shellDeploy.jpg)

> 服务端项目目录

![serverWeb](https://github.com/json-HB/marina/blob/master/assert/serverWeb.jpg)

> nginx 文件

![serverWeb](https://github.com/json-HB/marina/blob/master/assert/nginx.jpg)

------

