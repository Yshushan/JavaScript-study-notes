**git log**

```
# --patch, -p
git log -p
```

- **`git log --patch [-p]`**: Show the difference (the patch output) introduced in each commit
- **`git log -p -n`**: limit the number of log entries displayed
- **`git log --stat/--shortstat`**: Show statistics for files modified in each commit
- **`git log --pretty=oneline`**: prints each commit on a single line
- **`git log --pertty=format**:"%h %s"`**: specify your own log output format
- **`git log --pertty=format**:"%h %s" --graph`**: adds a nice little ASCII graph showing your branch and merge history
- **`git log --abbrev-commit`**: Show only the first few characters of the SHA-1 checksum instead of all 40
- **`git log --oneline`**: Shorthand for `--pretty=oneline` `--abbrev-commit` used together
- **`git log --relative-date`**: Display the date in a relative format (for example, “2 weeks ago”) instead of using the full date format
- **`git log --since=/--after=`**: Limit the commits to those made after the specified date
- **`git log --until=/--before=`**: Limit the commits to those made before the specified date
- **`git log --author=`**: Only show commits in which the author entry matches the specified string.
- **`git log --grep=`**: Only show commits with a commit message containing the string
- **`git log -S`**: Only show commits adding or removing code matching the string

## Cloning an Exsiting Repository
### git clone \<url\>




## 常用命令
- **`git init`**: 把当前文件夹初始化为 git 仓库
- **`git clone url/to/repository/projectname`**: 克隆远程仓库，会在当前目录创建一个名为 `projectname` 的文件夹，并初始化这个文件夹，同时拉取这个仓库所有的数据到本地。
- **`git clone url/to/repository/projectname myproject`**: 作用同上个命令，只不过本地文件夹的名字可以自定义为 `myproject`。
- **`git status` / `git status -s(--short)`**: 查看当前目录的状态
- **`git diff`**: 查看当前 unstaged 的改变
- **`git diff --staged`**: 查看当前 staged 的变更
- **`git difftool`**: 打开图形界面查看 unstaged 的变更
- **`git commit`**: 启动编辑器，填写 commit message 然后退出编辑器(vim 退出命令为 `:wq`)，提交当前变更。
- **`git commit -m 'commit message'`**: 不启动编辑器，直接在命令行里填写 commit message，并提交更新。
- **`git commit -a -m 'commit message'`**: 跳过 `git add` 步骤， stage 和 commit 一步完成，`-a` 表示 `git add *`，既 stage 当前所有变更。
  