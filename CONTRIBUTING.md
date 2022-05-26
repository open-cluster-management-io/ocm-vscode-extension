<!-- markdownlint-disable MD041 -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Contributing guidelines](#contributing-guidelines)
  - [Contributions](#contributions)
  - [Certificate of Origin](#certificate-of-origin)
  - [Contributing A Patch](#contributing-a-patch)
  - [Issue and Pull Request Management](#issue-and-pull-request-management)
  - [Development](#development)
    - [Early Access](#early-access)
    - [Useful Links](#useful-links)
    - [Environment Preparations](#environment-preparations)
    - [Project Layout](#project-layout)
    - [NPM Scripts](#npm-scripts)
    - [Coding Guidelines](#coding-guidelines)
    - [Launch Configurations](#launch-configurations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contributing guidelines

## Contributions

All contributions to the repository must be submitted under the terms of the [Apache Public License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Certificate of Origin

By contributing to this project you agree to the Developer Certificate of
Origin (DCO). This document was created by the Linux Kernel community and is a
simple statement that you, as a contributor, have the legal right to make the
contribution. See the [DCO](DCO) file for details.

## Contributing A Patch

1. Submit an issue describing your proposed change to the repo in question.
2. The [repo owners](OWNERS) will respond to your issue promptly.
3. Fork the desired repo, develop and test your code changes.
4. Submit a pull request.

## Issue and Pull Request Management

Anyone may comment on issues and submit reviews for pull requests. However, in
order to be assigned an issue or pull request, you must be a member of the
[open-cluster-management](https://github.com/open-cluster-management-io) GitHub organization.

Repo maintainers can assign you an issue or pull request by leaving a
`/assign <your Github ID>` comment on the issue or pull request.

## Development

### Early Access

Early-access pre-release is available [here][early-access] and will always reflect the current development snapshot from the *main* branch.

### Useful Links

- [VSCode API Documentation][vscode-ext-api]
- [VSCode API References][vscode-api-ref]

### Environment Preparations

All you need is [VSCode][vscode] and [NodeJS][nodejs].

> This project was built with *NodeJS 16* and *VSCode 1.65.2*.

### Project Layout

- [src][repo-src] contains the source code for the extension.
- [tests][repo-tests] contains the sources for the unit tests.
- [integration-tests][repo-integration-tests] contains the sources for integration tests.
- [snippets][repo-snippets] contains the snippets offered by the extension.
- [templates][repo-templates] contains template files for orchestrating new projects.
- [images][repo-images] contains various images used throughout the project.
- [test-workspace][repo-test-workspace] used for integration testing, git is keeping it and ignoring its content.

### NPM Scripts

- `npm install` will install all the required modules for the project.
- `npm run lint` will lint all *typescript* sources.
- `npm run tests` will run the unit tests.
- `npm run tests:cov` will run the unit tests and verify and summarize the code coverage.
- `npm run tests:cov-rep` will run the unit tests and verify the coverage creating an HTML coverage report.
- `npm run build` will lint, compile, test, and verify the code coverage for the project.
- `npm run clean:build` will remove any pre-compiled sources before building.
- `npm run integration-tests` will run the integration tests.
- `npm run clean` will remove the compiled sources
- `npm run clean-ext` will clean *vscode*'s extension testing folder (.vscode-test).
- `npm run clean-test-ws` will clean all content from the testing folder (test-workspace) excluding *.gitkeep*.
- `npm run clean:all` will execute the above three clean scripts.
- `npm run vsce:package` will build the VSIX package.

### Coding Guidelines

For maintainability, readability, and testing purposes, as well as for the overall robustness of this project,
we separate the various *vscode* integrations from their underlying implementations.</br>

For example, at the time of writing this, *vscode* integrations reside in the [commands package][repo-src-commands] and the
underlying implementations reside in the [utils package][repo-src-utils].</br>
Take the layout of the package with a pinch of salt, but also take the following couple of rules of thumb under
consideration while contributing code:

- The *vscode* integration part should be as small as possible, and functions should be perceived as wrappers for
  the underlying implementations.
- The underlying implementations should be completely decoupled from *vscode*'s API.

In regards to testing,</br>
*vscode*'s integration should be tested within the context of [integration tests][repo-integration-tests],</br>
the underlying implementations can, and probably should be tested within the context of [unit tests][repo-tests].

Please be as informative as possible when opening pull requests.

### Launch Configurations

- *Run Extension* will run the extension in a separate *vscode instance*.
- *Extension Tests* will execute the integration tests in debug mode.

<!-- LINKS -->
[early-access]: https://github.com/open-cluster-management-io/ocm-vscode-extension/releases/tag/early-access
[nodejs]: https://nodejs.org
[vscode-api-ref]: https://code.visualstudio.com/api/references/vscode-api
[vscode-ext-api]: https://code.visualstudio.com/api
[vscode]: https://code.visualstudio.com/
<!-- CODE LINKS -->
[repo-integration-tests]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/integration-tests
[repo-images]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/images
[repo-snippets]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/snippets
[repo-src]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/src
[repo-src-commands]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/src/commands
[repo-src-utils]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/src/utils
[repo-templates]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/templates
[repo-tests]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/tests
[repo-test-workspace]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/test-workspace
