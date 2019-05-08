## 常用命令
- **`git init`**: 把当前文件夹初始化为 git 仓库
- **`git clone url/to/repository/projectname`**: 克隆远程仓库，会在当前目录创建一个名为 `projectname` 的文件夹，并初始化这个文件夹为本地 git 仓库，同时拉取远程仓库所有的数据到本地仓库。该命令会自动设置本地 master 分支跟踪远程 master 分支，执行完 `git clone` 命令之后，可以直接运行 `git pull` 命令，将远程 master 分支合并到本地 master 分支。
- **`git clone url/to/repository/projectname myproject`**: 作用同上个命令，只不过本地文件夹的名字可以自定义为 `myproject`。
- **`git status` / `git status -s(--short)`**: 查看当前目录的状态
- **`git diff`**: 查看当前未暂存 (unstaged) 的变更
- **`git diff --staged`**: 查看已暂存 (staged) 的变更
- **`git difftool`**: 打开图形界面查看未暂存的变更
- **`git commit`**: 启动编辑器，填写 commit message 然后退出编辑器(vim 退出命令为 `:wq`)，提交当前变更。
- **`git commit -m 'commit message'`**: 不启动编辑器，直接在命令行里填写 commit message，并提交更新。
- **`git commit -a -m 'commit message'`**: 跳过 `git add` 步骤， stage 和 commit 一步完成，`-a` 表示 `git add *`，既 stage 当前所有变更。
- **`git rm <file>/<directory>`**: 移除已提交且未更改的文件/文件夹，同时从版本库和本地目录中移除，移除文件之后再执行一次 `git commit` 命令完成移除操作。
    >注意：
  >1. 如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件且从本地目录中删除，使用 `git rm <file> -f` 命令。
  >2. 如果文件处于已更改或已暂存但未提交状态，要从版本库中移除该文件但在本地目录中保留该文件，使用 `git rm <file> --cached` 命令。
  >3. 如果简单使用 `rm <file>` 移除本地文件，要想从版本库中移除还需执行一次 `git rm <file>` 命令。
- **`git mv <file_from> <file_to>`**: 文件重命名
- **`git commit --amend`**: 启动编辑器，填写提交信息，并覆盖上一次已提交历史，该命令用于撤销上一次提交记录，并用本次提交替换上一次提交。
- **`git commit --amend -m 'commit message'`**: 作用同上，但是不启动编辑器。
- **`git reset HEAD <file>`**: 取消暂存
- **`git checkout -- <file>`**: 撤销文件自上次提交以来的所有更改
- **`git remote`**: 展示关联的远程仓库的名字
- **`git remote -v`**: 同上，同时显示远程仓库的 url
- **`git remote add <shortname> <romote-repository-url>`**: 为本地仓库添加远程仓库，并命名为 `shortname`
- **`git fetch <remote>`**: 获取远程仓库的最新数据到本地，但是不会自动与本地分支合并，需要手动合并。
- **`git pull`**: 如果你当前所在分支已经设置为跟踪远程仓库的某个分支，执行该命令，将会自动 fetch 和 merge 远程分支的数据到本地分支
- **`git push <remote> <branch>`**: 将当前分支推送到远程分支
- **`git remote show <remote>`**: 查看远程仓库的详细信息
- **`git remote rename <oldname> <newname>`**: 重命名远程仓库的名字
- **`git remote remove <remote>`**: 删除远程仓库
- **`git config --global alias.shorthand 'commmad'`**: 给命令创建别名，例如 `git config --global alias.unstage 'reset HEAD --'`



## git log 查看提交历史

- **`git log --patch(-p)`**: 展示每次提交引入的变更
- **`git log -n`**: 展示最近 n 次提交记录
- **`git log --stat / --shortstat`**: 展示每次提交的变更的统计信息
- **`git log --pretty=oneline`**: 以单行展示每一次提交的简略信息
- **`git log --pertty=format:"%h %s"`**: 指定输出的格式
  > |Option| Description of output|
  > |:---:|:---:|
  > |%H|提交的完整 hash|
  > |%h|提交 hash 的简写（前7个字符）|
  > |%an| 作者名字|
  > |%ae|作者 email|
  > |%ad| author 时间，绝对时间|
  > |%ar| author 时间，相对时间|
  > |%s|提交信息|
  > |%cn| 提交者名字|
  > |%ce|提交者email|
  > |%cd| 提交时间，绝对时间|
  > |%cr| 提交时间，相对时间|

- **`git log --pertty=format:"%h %s" --graph`**: adds a nice little ASCII graph showing your branch and merge history
- **`git log --abbrev-commit`**: Show only the first few characters of the SHA-1 checksum instead of all 40
- **`git log --oneline`**: `git log --pretty=oneline --abbrev-commit` 的简写
- **`git log --relative-date`**: Display the date in a relative format (for example, “2 weeks ago”) instead of using the full date format
- **`git log --since= / --after=`**: 展示指定日期之后的的提交历史，可以是 `"2019-03-23"`，`"2 years 1 day 3 minutes ago` 这样的格式
- **`git log --until= / --before=`**: 展示指定日期之前的的提交历史，同上
- **`git log --author=`**: Only show commits in which the author entry matches the specified string.
- **`git log --grep=`**: Only show commits with a commit message containing the string
- **`git log -S`**: Only show commits adding or removing code matching the string



  