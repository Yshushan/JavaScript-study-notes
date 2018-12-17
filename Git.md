**git log**
```
# --patch, -p
git log -p
```
+ **git log --patch [-p]**: Show the difference (the patch output) introduced in each commit
+ **git log -p -n**: limit the number of log entries displayed
+ **git log --stat/--shortstat**: Show statistics for files modified in each commit
+ **git log --pretty=online**: prints each commit on a single line
+ **git log --pertty=format:"%h %s"**: specify your own log output format
+ **git log --pertty=format:"%h %s" --graph**: adds a nice little ASCII graph showing your branch and merge history
+ **git log --abbrev-commit**: Show only the first few characters of the SHA-1 checksum instead of all 40
+ **git log --oneline**: Shorthand for `--pretty=oneline` `--abbrev-commit` used together
+ **git log --relative-date**: Display the date in a relative format (for example, “2 weeks ago”) instead of using the full date format
+ **git log --since=/--after=**: Limit the commits to those made after the specified date
+ **git log --until=/--before=**: Limit the commits to those made before the specified date
+ **git log --author=**: Only show commits in which the author entry matches the specified string.
+ **git log --grep=**: Only show commits with a commit message containing the string
+ **git log -S**: Only show commits adding or removing code matching the string