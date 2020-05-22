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
When one of the build commands returns a non-zero exit code, the Travis CI build runs the subsequent commands as well and accumulates the build result.

In the example above, if `npm run docs:build` returns an exit code of 1, the following command `npm run build` is still run, but the build will result in a failure.

You can change this behavior by using a little bit of shell magic to run all commands subsequently but still have the build fail when the first command returns a non-zero exit code. Here’s the snippet for your `.travis.yml`:
```yaml
script: npm run docs:build && npm run build
```

If you have a complex build environment that is hard to configure in the `.travis.yml`, consider moving the steps into a separate shell script. The script can be a part of your repository and can easily be called from the `.travis.yml`

### Deploying your code

An optional phase in the job lifecycle is deployment. This phase is defined by using one of our continuous deployment providers to deploy code to Heroku, Amazon, or a different supported platform. The deploy steps are skipped, if the build is broken.

When deploying files to a provider, prevent Travis CI from resetting your working directory and deleting all changes made during the build ( `git stash --all`) by adding `skip_cleanup` to your `.travis.yml`:
```yaml
deploy:
  skip_cleanup: true
```

You can run commands before a deploy by using the `before_deploy` phase. A non-zero exit code in this phase will mark the build as **errored**.

If there are any steps you’d like to run after the deployment, you can use the `after_deploy` phase. This phase does not affect the status of the build.

> Note that `before_deploy` and `after_deploy` are run before and after every deploy provider, so they will run multiple times, if there are multiple providers.

## Build Matrix
A build matrix is made up by several multiple jobs that run in parallel.

This can be useful in many cases, but the two primary reasons to use a build matrix are:

- Reducing the overall build execution time
- Running tests against different versions of runtimes or dependencies

There are two ways to define a matrix in the .travis.yml file:

- Using the Matrix Expansion feature
- Listing individual job configs

Both features can be combined.