# Vue-CLI3
## 创建项目
+ 通过 prompts 手动选择需要的特性：

      vue create <app-name>

+ 跳过 prompts，使用默认的 preset（babel + eslint)： `-d, --default`

      vue create -d <app-name>

+ 跳过 prompts，使用之前保存在用户本地主目录下的 preset（`.vuerc` 文件），或者使用 romote preset (GitHub repo)：`-p, --preset`

      vue create -p <app-name>
      vue create -p username/repo <app-name>
    
+ 使用 GUI：

      vue ui
## 在已存在的项目中安装 plugin
在创建项目的过程中 Vue 会根据你选择的特性预安装一些 plugin，如果你想在已存在的项目的再添加一些 plugin，可以使用 `vue add` 命令，例如: 

    vue add @vue/eslint
    
通过该命令，Vue 会将 `@vue/eslint` 解析成该包的全名 `@vue/cli-plugin-eslint` (所以上面的命令等价于 `vue add @vue/cli-plugin-eslint`)，然后通过 `npm` 安装，并调用它的 `generator` 生成相关配置文件，注入到内部 `webpack` 中。

> 注意： `vue add` 命令是专为 Vue CLI plugins 提供的，包括 Vue CLI build-in plugins（以 `@vue/cli-plugin-` 为前缀）和第三方 Vue CLI plugins（以 `vue-cli-plugin-` 或 `@scope/vue-cli-plugin-` 为前缀)，对于常规的 npm packages，仍然需要使用 npm 命令来安装。

`vue-router` 和 `vuex` 是特例，如果在创建项目时没有选择它们，也可以通过 `vue add` 命令来添加，虽然它们不属于 Vue CLI plugin 的范畴：

    vue add vue-router
    vue add vuex

## 预设（Preset）
preset 是一个包含一些预先定义好的 options 和 plugins 的 JSON 对象，这些 options 和 plugins 是之前通过 `vue create` 创建新项目时选择的一些特性，它们被保存在用户主目录的 `.vuerc` 文件中。可以直接编辑该文件来更改、添加配置。

使用 `vue create` 创建项目时，通过使用 preset 可以跳过 prompt 过程，重用已有的配置来创建项目。

## 静态资源处理
Vue CLI 项目中，对静态资源（static assets）有两种不同的处理方式。
+ **相对路径导入（Relative path imports）**

  如果在 `.js`, `.css`, `.vue` 文件中以相对路径（以 `.` 开头）引用静态资源，这些静态文件会被包含到 `webpack` 的依赖图（dependency graph）中，在 `webpack` 编译时，会将所有的相对 url（如 `<img src="...">`, `background: url(...)`, css `@import`, js `import`）当作模块依赖（module dependencies）来解析。
  
  例如，`url(./image.png)` 将被转换成 `require("./image.png")`，而 `<img src="./image.pgn">` 将被转换成 `h("img",{attrs:{src: require("./image.png")}})`。

  而在内部，`webpack` 使用 `file-loader` 来确定文件最终的正确位置，同时使用 `url-loader`，根据设置好的内联文件大小限制（inline file size limit）来确定是否使用内联资源（inline assets），以达到减少 HTTP 请求的目的。
  
+ **public 文件夹**

  放在 public 文件夹内的静态资源，需要用绝对路径引用，而在编译过程中，这一类资源不会经过 `webpack` 处理，仅仅只是被复制到目标位置。
  > 注意：public 文件夹只是做为 “escape hatch” 来使用，也就是说，除非必须要使用它，否则不要使用它！把资源引用作为模块依赖图的一部分，通过 `webpack` 来处理这些资源是更好的选择。
  
  如果你用绝对路径引用了 public 文件夹里的资源，那么你必须要考虑你项目将要部署的位置，如果你的项目不是部署在域名的根目录，那么你需要在引用的 url  前添加 `baseUrl` 前缀，例如：
  
  在 `public/index.html` 文件或其它将被 `html-webpack-plugin` 处理的模板文件内引用 public 内的静态资源时，你需要这样做：
  ```html 
  <link rel="icon" href="<%= BASE_URL %>my-icon.ico">
  ```
  在组件中，你需要这样做：
  ```javascript
  <img :src="`${baseUrl}my-image.png`">
  
  data() {
      return {
            baseUrl: process.env.BASE_URL
      }
  }
  ```

### URL 转换规则
+ 如果 url 是绝对路径（例如：`/images/my-pic.jpg`），它将被原样保留。
+ 如果 url 是相对路径（以 `.` 开头），它将被解释为相对模块请求，并基于你的文件夹结构来解析。
+ 如果 url 以 `~` 开头，`~` 后面的部分将被解析为模块请求，这意味着你可以直接引用 `node_modules` 里的资源：

      <img src="~some-npm-package/some-pic.pgn">

+ 如果 url 以 `@` 开头，其后面的部分也将被解析为模块请求，因为 Vue CLI 默认地将 `@` 设置为 `<projectRoot>/src` 的别名，所以以 `@` 开头的 url，`webpack` 将会去 `src` 文件夹内寻找模块。

## CSS 处理
所有编译过的 css，都是由 `css-loader` 来处理的，它解析 url，并将它们作为模块请求来处理，这意味者你可以像上面说的那样，使用相对路径来引用 css 资源。
### 预处理器（Pre-Processors)
在创建项目时，你可以选择一个预处理器（Sass/Less/Stylus），如果你没有选择，Vue CLI 在内部的 webpack 配置中仍然会为你预先设置好一些配置。所以后面如果你需要用到预处理器，你只需要安装相应的 webpack loader 即可：
```
# Sass
npm install -D sass-loader node-sass

# Less
npm install -D less-loader less

# Stylus
npm install -D stylus-loader stylus
```
然后你就只需要引入相应类型的文件，或者在 `.vue` 文件中：
```scss
<style lang="scss">
$color=red
</style>
```
一切都将正常工作。
### 自动导入（Automatic imports）
如果你想自动导入样式文件（colors, variables, mixins...），可以使用 `style-resources-loader`，详情看[这里](https://cli.vuejs.org/guide/css.html#automatic-imports)。

### CSS 模块（CSS Modules）
`.vue` 文件通过 `<style module>` 提供了开箱即用的 CSS Modules。

如果想要在 JavaScript 里将 css 文件或者其它预处理文件作为 CSS Modules 导入，你需要将这些文件的文件名命名为以 `.module.(css|scss|sass|less|styl)` 结尾：
```js
import styles from './foo.module.css'
import scssStyles from '/bar.module.scss'

document.querySelector("#app").classList.add(scssStyles.someClass)
```
更多细节移步[这里](https://cli.vuejs.org/guide/css.html#css-modules)。
## 环境变量与模式（mode）
你可以通过在项目根目录下创建如下这些文件来制定系统的环境变量：
```
.env                    # 在所有环境下都被加载
.env.local              # 在所有环境下都被加载，同时被 git 忽略
.env.[mode]             # 只被对应的 mode 环境加载
.env.[mode].local       # 只被对应的 mode 环境加载，同时被 git 忽略
```
一个 `.env` 文件的结构很简单，仅仅是包含一些环境变量的键值对：
```
NAME=Nicholas
VUE_APP_BAR=bar
```
被加载的环境变量可以被所有的 `vue-cli-service` 命令，插件（plugins）以及依赖项（dependencies）使用。
> **关于优先级**
> + 指定了具体 mode 的环境变量文件(`.env.[mode]`)具有比普通环境变量文件(`.env`)更高的优先级。
> + Vue CLI 启动时已经存在的环境变量具有最高的优先级，且不会被 `.env` 文件覆盖。
  
### 模式（mode）
Vue CLI 项目有三种环境模式:
```
vue-cli-service serve                                   # 启动开发环境模式 (development)
vue-cli-service build / vue-cli-service test:e2e        # 启动生产环境模式 (production)
vue-cli-service test:unit                               # 启动测试环境模式 (test)
```
在每个环境下，`NODE_ENV` 被默认地设置为对应的值，例如在开发环境(development)下，`NODE_ENV` 被设置为 `"development"`。

你也可以通过传递 `--mode` 选项给 `vue-cli-service` 命令来手动覆盖默认的模式，例如：
```
vue-cli-service build --mode development
```
### 在客户端代码中使用环境变量
在环境变量文件中，只有那些以 `VUE_APP_` 开头的变量才能在客户端代码中使用，例如你可以在你的应用中写这样的代码：
```js
console.log(process.env.VUE_APP_BAR)
```
在代码构建时，`webpack.DefinePlugin` 会将 `process.env.VUE_APP_BAR` 替换成对应的值 (`"bar"`)。

除了 `VUE_APP_*` 变量，还有两个特殊的环境变量: `NODE_ENV` 和 `BASE_URL`，它们在你的 app 代码中总是可用的：
+ `NODE_ENV` 根据你的 app 当前运行的 mode， 有三种不同的取值：`"development"`, `"production"`, `"test"`。
+ `BASE_URL` 代表的是你的项目部署的基路径(base path), 它的值取决于 `vue.config.js` 中的 `baseUrl` 选项。

此外，所有的客户端环境变量在 `public/index.html` 中都可以做为 `interpolation` 使用。更多细节请参考[这里](https://cli.vuejs.org/guide/mode-and-env.html#using-env-variables-in-client-side-code)。

## 构建目标（Build Targets）
当运行 `vue-cli-service build` 命令时，你可以通过 `--target` 选项指定构建目标，这意味着你可以使用相同的代码库为不同的使用场景生成不同的构建结果。
#### App
如果你不特别指定构建目标，App是默认的构建目标，在 App 模式下，
+ `index.html` with asset and resource hints injection
+ 第三方库被分割成单独的 chunk，以实现更好的缓存
+ 小于40kb的静态资源被内联到 JavaScript 中
+ `public` 下的静态资源被复制到输出目录

### Library
你可以将某个入口文件构建成库(library)：

    vue-cli-service build --target lib --name mylib [entry]
    
入口文件 `entry` 可以是一个 `.js` 或者 `.vue` 文件，如果没有指定 `entry`，默认将 `src/App.vue` 作为 `entry`

一个 library build 的输出目录如下：
```
dist/mylib.umd.min.js     # Minified version of the UMD build
dist/mylib.umd.js         # A UMD bundle for consuming directly in browsers or with AMD loaders
dist/mylib.common.js      # A CommonJS bundle for consuming via bundlers（不幸的是，webpack 当前对于 build bundle 还不支持 ES module 输出格式
dist/mylib.css            # 提取的 css 文件 (can be forced into inlined by setting `css: { extract: false }` in `vue.config.js`)
```
更多细节移步[这里](https://cli.vuejs.org/guide/build-targets.html#library)


## vue.config.js 配置参考
`vue.config.js` 是一个可选的配置文件，如果它存在于你的项目根目录下，它将会自动的被 `@vue/cli-service` 加载。当然你也可以直接在 `package.json` 里的 `vue` 字段下进行配置，来代替这个配置文件，但这不是推荐的做法，因为这样会受限于 `json` 的语法。

`vue.config.js` 文件应该导出一个包含配置选项的对象：
```js
module.exports = {
  // options...
}
```
### baseUrl
这个选项代表的是你打包后的应用将要部署的基路径 (base URL)，它等价于 `webpack` 的 `output.publicPath`，但是 Vue CLI 在其它地方也需要用到这个值，所以你应该总是配置 `baseUrl`，而不是去配置 `webpack` 的 `output.publicPath`.

Vue CLI 默认你的应用将部署到域名的根，例如 `https://www.my-app.com/`，所以 `baseUrl` 的默认值是 `'/'`，如果你的应用将要部署到子路径，那你应该用这个选项去指定这个子路径，例如，你的应用部署在 `https://www.foobar.com/my-app/`，那么 `baseUrl` 应该设置为 `'/my-app/'`。

也可以为开发模式 (development) 配置这个值，如果你想让你的开发服务器(dev server) 服务于域的根，你可以这样做：
```js
module.exports={
  baseUrl: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/'
}
```
`baseUrl` 的值也可以只是一个空字符串 `''`，或者是一个相对路径 `'./'`。详细请看[这里](https://cli.vuejs.org/config/#baseurl)

### outputDir
这个选项代表的是你的生产环境构建 (`vue-cli-service build`) 的输出目录，默认值为 `'dist'`，在进行生产构建之前，这个目录将会被清空（这个行为可以通过传递命令行选项 `--no-clean` 来关闭）。

`outputDir` 选项等价于 `webpack` 的 `output.path`，但是同 `baseUrl` 一样，你应该总是配置 `outputDir`，而不是 `webpack` 的 `output.path`。

### indexPath
指定生成的 `index.html` 的输出路径 (相对于 `outputDir`)，默认值是 `'index.html'`，也可以是绝对路径。

### filenameHashing
为了能够更好的进行缓存控制，构建生成的静态资源的文件名中会带有 hash，因此这个选型的默认值为 `true`，但前提是你必需要让 Vue CLI 去自动生成 `index.html` 文件。如果你不想使用自动生成 `index.html` 的机制，你可以通过设置这个选项为 `false` 来关闭 filename hashing 特性。

### pages
此选项是为构建多页应用 (multi-page app) 提供的配置对象，默认值为 `undefined`，即，Vue ClI 默认构建单页应用，关于多页应用的配置请看[这里](https://cli.vuejs.org/config/#pages)。

### lintOnSave
开发过程中是否在文件保存时执行代码检查 (lint-on-save)，默认值为 `true`。这个选项只有当项目中安装了 `@vue/cli-plugin-eslint` 才会生效。

当该值为 `true` 时，`eslint-loader` 只会在 terminal 中输出 warning，不会导致编译失败。
如果你想让错误在浏览器中输出，可以将 `lintOnSave` 设置为 `'error'`，这将迫使 `eslint-loader` 总是给出 error，同时也意味着编译会失败。

当 `lintOnSave` 为“真值”时，`eslint-loader` 在开发环境和生产环境都会执行检测，如果你想在生产构建时关闭 `eslint-loader`，可以这样配置：
```js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production'
}
```