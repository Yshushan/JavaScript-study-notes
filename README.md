## Vue-CLI3
### 创建项目
+ 通过 prompts 手动选择需要的特性：

      vue create <app-name>

+ 跳过 prompts，使用默认的 preset（babel + eslint)： `-d, --default`

      vue create -d <app-name>

+ 跳过 prompts，使用之前保存在用户本地主目录下的 preset（`.vuerc` 文件），或者使用 romote preset (GitHub repo)：`-p, --preset`

      vue create -p <app-name>
      vue create -p username/repo <app-name>
    
+ 使用 GUI：

      vue ui
### 在已存在的项目中安装 plugin
在创建项目的过程中 Vue 会根据你选择的特性预安装一些 plugin，如果你想在已存在的项目的再添加一些 plugin，可以使用 `vue add` 命令，例如: 

    vue add @vue/eslint
    
通过该命令，Vue 会将 `@vue/eslint` 解析成该包的全名 `@vue/cli-plugin-eslint` (所以上面的命令等价于 `vue add @vue/cli-plugin-eslint`)，然后通过 `npm` 安装，并调用它的 `generator` 生成相关配置文件，注入到内部 `webpack` 中。

> 注意： `vue add` 命令是专为 Vue CLI plugins 提供的，包括 Vue CLI build-in plugins（以 `@vue/cli-plugin-` 为前缀）和第三方 Vue CLI plugins（以 `vue-cli-plugin-` 或 `@scope/vue-cli-plugin-` 为前缀)，对于常规的 npm packages，仍然需要使用 npm 命令来安装。

`vue-router` 和 `vuex` 是特例，如果在创建项目时没有选择它们，也可以通过 `vue add` 命令来添加，虽然它们不属于 Vue CLI plugin 的范畴：

    vue add vue-router
    vue add vuex

### 预设（preset）
preset 是一个包含一些预先定义好的 options 和 plugins 的 JSON 对象，这些 options 和 plugins 是之前通过 `vue create` 创建新项目时选择的一些特性，它们被保存在用户主目录的 `.vuerc` 文件中。可以直接编辑该文件来更改、添加配置。

使用 `vue create` 创建项目时，通过使用 preset 可以跳过 prompt 过程，重用已有的配置来创建项目。

### 静态资源处理
Vue CLI 项目中，静态资源（static assets）有两种不同的处理方式
+ **相对路径导入（relative path importas）**

  如果在 `.js`, `.css`, `.vue` 文件中以相对路径（以 `.` 开头的路径）引用静态资源，这些静态文件会被包含到 `webpack` 的依赖图（dependency graph）中，在 `webpack` 编译时，会将所有的相对 url（如 `<img src="...">`, `background: url(...)`, css `@import`, js `import`）作为模块依赖（module dependencies）来解析。
  
  例如，`url(./image.png)` 将被转换成 `require("./image.png")`，而 `<img src="./image.pgn">` 将被转换成 `h("img",{attrs:{src: require("./image.png")}})`。

  而在内部，`webpack` 使用 `file-loader` 来确定文件最终的正确位置，同时使用 `url-loader`，根据设置好的内联文件大小限制（inline file size limit）来确定是否使用内联资源（inline assets）的方式，来达到减少 HTTP 请求的目的。
  
+ **public 文件夹**

  放在 public 文件夹内的静态资源，需要用绝对路径引用，而在编译过程中，这一类资源不会经过 `webpack` 处理，仅仅只是被复制到目标位置
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
  
