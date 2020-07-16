# Travis CI

The `.travis.yml` file describes the build process. **A build in Travis CI is a sequence of stages. Each stage consists of jobs run in parallel.**

## Job

Travis CI provides a default build environment and a default set of phases for each programming language. A virtual machine is created with the build environment for your job, your repository is cloned into it, optional addons are installed and then your build phases are run.

### The Job Lifecicle

Each job is a sequence of phases. The main phases are:

1. `install` - install any dependencies required
2. `script` - run the build script

Travis CI can run custom commands in the phases:

1. `before_install` - before the install phase
2. `before_script` - before the script phase
3. `after_script` - after the script phase.
4. `after_success` - when the build succeeds (e.g. building documentation), the result is in `TRAVIS_TEST_RESULT` environment variable
5. `after_failure` - when the build fails (e.g. uploading log files), the result is in `TRAVIS_TEST_RESULT` environment variable

There are three optional deployment phases.

The complete sequence of phases of a job is the lifecycle. The steps are:

1. OPTIONAL Install `apt addons`
2. OPTIONAL Install `cache components`
3. `before_install`
4. `install`
5. `before_script`
6. `script`
7. OPTIONAL `before_cache` (for cleaning up cache)
8. `after_success` or `after_failure`
9. OPTIONAL `before_deploy`
10. OPTIONAL `deploy`
11. OPTIONAL `after_deploy`
12. `after_script`

### Customizing the Installation Phase

The default dependency installation commands depend on the project language.

You can specify your own script to install your project dependencies:

```yaml
install: ./install-dependencies.sh
```

> When using custom scripts, they should be executable (for example, using `chmod +x`) and contain a valid shebang line such as `/usr/bin/env sh`, `/usr/bin/env ruby`, or `/usr/bin/env python`.

You can also provide multiple steps, for instance to install both ruby and node dependencies:

```yaml
install:
  - bundle install --path vendor/bundle
  - npm install
```

Skip the installation step entirely by adding the following to your `.travis.yml`:

```yaml
install: skip
```

### Customizing the Build Phase

The default build command depends on the project language.

You can overwrite the default build step in `.travis.yml`:

```yaml
script: npm run docs:build
```

You can specify multiple script commands as well:

```yaml
script:
  - npm run docs:build
  - npm run build
```

When one of the build commands returns a non-zero exit code, the Travis CI build runs the subsequent commands as well and
accumulates the build result.

In the example above, if `npm run docs:build` returns an exit code of 1, the following command `npm run build` is still run,
but the build will result in a failure.

You can change this behavior by using a little bit of shell magic to run all commands subsequently but still have the build
fail when the first command returns a non-zero exit code. Here’s the snippet for your `.travis.yml`:

```yaml
script: npm run docs:build && npm run build
```

If you have a complex build environment that is hard to configure in the `.travis.yml`, consider moving the steps into a
separate shell script. The script can be a part of your repository and can easily be called from the `.travis.yml`

### Deploying your code

An optional phase in the job lifecycle is deployment. This phase is defined by using one of our continuous deployment providers
to deploy code to Heroku, Amazon, or a different supported platform. The deploy steps are skipped, if the build is broken.

When deploying files to a provider, prevent Travis CI from resetting your working directory and deleting all changes made
during the build ( `git stash --all`) by adding `skip_cleanup` to your `.travis.yml`:

```yaml
deploy:
  provider: pages
  skip_cleanup: true
  local_dir: docs/.vuepress/dist
  github_token: $GITHUB_TOKEN # Set in the settings page of your repository, as a secure variable
  keep_history: true
  on:
    branch: master
```

Deploying to multiple providers is possible by adding the different providers to the `deploy` section as a list. For example, if
you want to deploy to both cloudControl and Heroku, your `deploy` section would look something like this:

```yaml
deploy:
  - provider: pages
    skip_cleanup: true
    local_dir: docs/.vuepress/dist
    github_token: $GITHUB_TOKEN # Set in the settings page of your repository, as a secure variable
    keep_history: true
    on: # conditional deploy
      branch: master
  - provider: npm
    email: 'YOUR_EMAIL_ADDRESS'
    api_key: $NPM_AUTH_TOKEN
    on: # conditional deploy
      tags: true # tell Travis CI to only deploy on tagged commits
```

You can run commands before a deploy by using the `before_deploy` phase. A non-zero exit code in this phase will mark the build
as **errored**.

If there are any steps you’d like to run after the deployment, you can use the `after_deploy` phase. This phase does not affect
the status of the build.

> Note that `before_deploy` and `after_deploy` are run before and after every deploy provider, so they will run multiple times, if there are multiple providers.

## [Build Matrix](https://docs.travis-ci.com/user/build-matrix/)

A build matrix is made up by several multiple jobs that run in parallel.

This can be useful in many cases, but the two primary reasons to use a build matrix are:

- Reducing the overall build execution time
- Running tests against different versions of runtimes or dependencies

There are two ways to define a matrix in the .travis.yml file:

- Using the Matrix Expansion feature
- Listing individual job configs

Both features can be combined.

### Matrix Expansion

For example, the following configuration produces a build matrix that expands to 8 individual (2 _ 2 _ 2) jobs, combining each
value from the three matrix expansion keys `rvm`, `gemfile`, and `env`.

```yaml
rvm:
  - 2.5
  - 2.2
gemfile:
  - gemfiles/Gemfile.rails-3.2.x
  - gemfiles/Gemfile.rails-3.0.x
env:
  - ISOLATED=true
  - ISOLATED=false
```

### Listing individual jobs

In addition, jobs can be specified by adding entries to the key `jobs.include`

```yaml
jobs:
  include:
    - rvm: 2.5
      gemfile: gemfiles/Gemfile.rails-3.2.x
      env: ISOLATED=false
    - rvm: 2.2
      gemfile: gemfiles/Gemfile.rails-3.0.x
      env: ISOLATED=true
```

### Job Names

Jobs listed in `jobs.include` can be named by using the key name, like so:

```yaml
jobs:
  include:
    - name: Job 1
      script: echo "Running job 1"
```

This name will appear on the build matrix UI and can be convenient in order to quickly identify jobs in a large matrix.

Jobs generated through the Matrix Expansion feature cannot be named.

## [Build Stages](https://docs.travis-ci.com/user/build-stages/)

Build stages is a way to group jobs, and run jobs in each stage in parallel, but run one stage after another sequentially.

In the simplest and most common use case, you can now make one job run only if several other, parallel jobs have completed
successfully.

Let’s say you want to test a library like a Ruby gem or an npm package against various runtime (Ruby or Node.js)
versions in parallel. And you want to release your gem or package only if all tests have passed and completed
successfully. Build stages make this possible.

Of course, there are a lot more and a lot more elaborated use cases than this one. You can, for example, also use build
stages to warm up dependency caches in a single job on a first stage, then use the cache on several jobs on a second
stage. Or, you could generate a Docker image and push it first, then test it on several jobs in parallel. Or, you could
run unit tests, deploy to staging, run smoke tests and only then deploy to production.

A stage is a group of jobs that are allowed to run in parallel. However, each one of the stages runs one after another
and will only proceed, if all jobs in the previous stage have passed successfully. If one job fails in one stage, all
other jobs on the same stage will still complete, but all jobs in subsequent stages will be canceled and the build fails.

You can configure as many jobs per stage as you need and you can have as many stages as your delivery process requires.

In the following example, we are running two jobs on the first stage called test, and then run a single third job on the
second stage called deploy:

```yaml
jobs:
  include:
    - stage: test
      script: ./test 1
    - script: ./test 2 # stage name not required, will continue to use `test`
    - stage: deploy
      script: ./deploy
```

This configuration creates a build with three jobs, two of which
start in parallel in the first stage (named `test`), while the third job on the second stage (named `deploy`) starts only
after the test stage completes successfully.

### Naming Your Build Stages

Stages are identified by their names, which are composed of names and emojis. The first letter of a stage name is
automatically capitalized for aesthetical reasons, so you don’t have to deal with uppercase strings in your `.travis.yml`
file.

Also, you do not have to specify the name on every single job (as shown in the example above). The default stage is
`test`. Jobs that do not have a stage name are assigned to the previous stage name, if one exists or the default stage
name, if there is no previous stage name. This means that if you set the stage name on the first job of each stage, the
build will work as expected.

For example, the following config is equivalent to the one above, but also adds a second deploy job to the `deploy`
stage that deploys to a different target. As you can see, you only need to specify the stage name once:

```yaml
jobs:
  include:
    - script: ./test 1 # uses the default stage name "test"
    - script: ./test 2
    - stage: deploy
      script: ./deploy target-1
    - script: ./deploy target-2
```

### Naming Your Jobs within Build Stages

You can also name specific jobs within build stages. Jobs defined in the `jobs.include` section can be given a `name`
attribute as follows:

```yaml
jobs:
  include:
    - stage: 'Tests' # naming the Tests stage
      name: 'Unit Tests' # names the first Tests stage job
      script: ./unit-tests
    - script: ./integration-tests
      name: 'Integration Tests' # names the second Tests stage job
    - stage: deploy
      name: 'Deploy to GCP' # names the first deploy state job
      script: ./deploy
```

### Data Persistence between Stages and Jobs

It is important to note that jobs do not share storage, as each job runs in a fresh VM or container. If your jobs need
to share files (e.g., using build artifacts from the “Test” stage for deployment in the subsequent “Deploy” stage), you
need to use an external storage mechanism such as S3 and a remote scp server.

## [Conditional Builds, Stages and Jobs](https://docs.travis-ci.com/user/conditional-builds-stages-jobs/)

You can filter out and reject builds, stages and jobs by specifying conditions in your build configuration (your `.travis.yml` file).

### Conditional Builds

You can configure Travis CI to only run builds when certain conditions are met. Any builds that do not meet these conditions
are listed in the Requests tab of your repository, even though the actual build is not generated.

For example, this allows builds only to run on the `master` branch:

```yaml
# require the branch name to be master (note for PRs this is the base branch name)
if: branch = master
```

Build requests that do not match the condition will not generate a build, but will be listed on the Requests tab.

### Conditional Stages

You can configure Travis CI to only include stages when certain conditions are met. Stages that do not match the given
condition are silently skipped. For example, this allows the `deploy` stage to run only on the `master` branch:

```yaml
stages:
  - name: deploy
    # require the branch name to be master (note for PRs this is the base branch name)
    if: branch = master
```

### Conditional Jobs

You can configure Travis CI to only include jobs when certain conditions are met. For example, this includes the listed job
only to build on the `master` branch:

```yaml
jobs:
  include:
    - # require the branch name to be master (note for PRs this is the base branch name)
      if: branch = master
      env: FOO=foo
```

## Building a JavaScript and Node.js project

```yaml
language: node_js
node_js:
  - lts/*
install:
  - npm install # yarn install, default to "npm ci" or "npm install"
cache: npm # default,  cache dependencies
jobs:
  include:
    - name: deploy docs
      script: npm run docs:build
      deploy:
        provider: pages
        skip_cleanup: true
        local_dir: docs/.vuepress/dist
        github_token: $GITHUB_TOKEN # Set in the settings page of your repository, as a secure variable
        keep_history: true
        on:
          branch: master
    - name: npm release
      script: npm run build
      deploy:
        provider: npm
        email: yss_2016@outlook.com
        api_key: $NPM_AUTH_TOKEN
        on:
          tags: true
```
