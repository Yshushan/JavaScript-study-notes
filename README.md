## Vue-CLI3
### 创建项目
通过 prompts 手动选择需要的特性：

    vue create <app-name>

跳过 prompts，使用默认的 preset（babel + eslint)： `-d, --default`

    vue create -d <app-name>

跳过 prompts，使用之前保存在用户本地主目录下的 preset（`.vuerc` 文件），或者使用 romote preset (GitHub repo)：`-p, --preset`

    vue create -p <app-name>
    vue create -p username/repo <app-name>
    
使用 GUI：

    vue ui
### 在已存在的项目中安装 plugin
在创建项目的过程中 Vue 会根据你选择的特性预安装一些 plugin，如果你想在已存在的项目的再添加一些 plugin，可以使用 `vue add` 命令，例如: 

    vue add @vue/eslint
    
通过该命令，Vue 会将 `@vue/eslint` 解析成该包的全名 `@vue/cli-plugin-eslint` (所以上面的命令等价于 `vue add @vue/cli-plugin-eslint`)，然后通过 `npm` 安装，并调用它的 `generator` 生成相关配置文件，注入到内部 `webpack` 中。

> 注意 `vue add` 命令是专为 Vue CLI plugins 提供的，包括 Vue CLI build-in plugins（以 `@vue/cli-plugin-` 为前缀）和第三方 Vue CLI plugins（以 `vue-cli-plugin-` 或 `@scope/vue-cli-plugin-` 为前缀)，对于常规的 npm packages，仍然需要使用 npm 命令来安装。

`vue-router` 和 `vuex` 是特例，如果在创建项目时没有选择它们，也可以通过 `vue add` 命令来添加，虽然它们不属于 Vue CLI plugin 的范畴：

    vue add vue-router
    vue add vuex

### 预设（preset）
preset 是一个包含一些预先定义好的 options 和 plugins 的 JSON 对象，这些 options 和 plugins 是之前通过 `vue create` 创建新项目时选择的一些特性，它们被保存在用户主目录的 `.vuerc` 文件中。可以直接编辑该文件来更改、添加配置。

使用 `vue create` 创建项目时，通过使用 preset 可以跳过 prompt 过程，重用已有的配置来创建项目。
