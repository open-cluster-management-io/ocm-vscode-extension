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

### Project Layout

- [src][repo-src] contains the source code for the extension.
- [test][repo-test] contains the sources for the unit tests.
- [snippets][repo-snippets] contains the snippets offered by the extension.
- [templates][repo-templates] contains template files for orchestrating new projects.
- [images][repo-images] contains various images used throughout the project.
- [webview-ui][repo-webview-ui] contains the sources for *react* module providing the *web view*.

### NPM Scripts

Install module dependencies:

```bash
npm i
```

Lint the project with *eslint*:

```bash
npm run lint
```

Test the project (sandbox tests):

```bash
npm test
```

Test the project skipping "slow" tests (sandbox tests):
> New "slow" tests should include `@slow` in their description.

```bash
npm run test:quick
```

Print and verify coverage ratio (requires tests to be executed first):

```bash
npm run cov
```

Create an *html* coverage report (requires tests to be executed first):

```bash
npm run cov:rep
```

Build the project (including the *web project*):

```bash
npm run build

```

List all available scripts:

```bash
npm run
```

### Launch Configurations

- *Run Extension* will run the extension in a separate *vscode instance*.
- *Extension Tests* will execute the tests in debug mode.

<!-- LINKS -->
[early-access]: https://github.com/open-cluster-management-io/ocm-vscode-extension/releases/tag/early-access
[nodejs]: https://nodejs.org
[vscode-api-ref]: https://code.visualstudio.com/api/references/vscode-api
[vscode-ext-api]: https://code.visualstudio.com/api
[vscode]: https://code.visualstudio.com/
<!-- CODE LINKS -->
[repo-images]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/images
[repo-snippets]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/snippets
[repo-src]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/src
[repo-templates]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/templates
[repo-test]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/test
[repo-webview-ui]: https://github.com/open-cluster-management-io/ocm-vscode-extension/tree/main/webview-ui
