# OCM VScode Extension

The `ocm-vscode-extension` helps quickly create Open Cluster Management (OCM) applications.

[Open Cluster Management][ocm-io] is a community-driven project focused on multicluster and multicloud scenarios for Kubernetes apps.

## Current Features

- Loading Custom Resources (CR) snippets from the command palette

![snippets-from-palette][gif-snippets]

- Create a new project for the various channel types

![new-project][gif-new-project]

- Create a local environment using [kind][kind], [clusteradm][clusteradm], and [kubectl][kubectl]:
  - Verify the existence of the required tools.
  - Create as many [kind][kind] clusters as you need.
  - Initialize the _hub cluster_ using [clusteradm][clusteradm], and [kubectl][kubectl].
  - Send join requests from the _managed clusters_ to the _hub cluster_ using [clusteradm][clusteradm], and [kubectl][kubectl].
  - Accept the join requests from the _hub cluster_ using [clusteradm][clusteradm], and [kubectl][kubectl].

## Installation

This extension is still in development and is available as pre-release development snapshots only.</br>
To get the latest snapshot visit [Early-access pre-release][early-access], scroll down to the _Assets_ section,
and download the version for your operating system.</br>
In your _vscode_ instance, select the _Extensions_ view container (ctrl+shift+x), click the **...** at the right corner of the palette, _Install from VSIX..._, and select the _VSIX_ file you downloaded.

## Requirements

- To apply the generated resources, the [Application Lifecycle Management Addon][app-mng-addon] should be installed and enabled in your hub/managed clusters.

## Road Map

- Execute [clusteradm][clusteradm] commands.
- Query hub/managed cluster resources.

## Contributing

See our [Contributing Guidelines][repo-contribute] for more information.

<!-- LINKS -->
[app-mng-addon]: https://open-cluster-management.io/getting-started/integration/app-lifecycle/
[clusteradm]: https://github.com/open-cluster-management-io/clusteradm
[early-access]: https://github.com/open-cluster-management-io/ocm-vscode-extension/releases/tag/early-access
[kind]: https://kind.sigs.k8s.io/
[kubectl]: https://kubernetes.io/docs/tasks/tools/
[ocm-io]: https://open-cluster-management.io/
[repo-contribute]: https://github.com/open-cluster-management-io/ocm-vscode-extension/contribute
<!-- GIFS -->
[gif-new-project]: https://raw.githubusercontent.com/open-cluster-management-io/ocm-vscode-extension/main/images/new-project.gif
[gif-snippets]: https://raw.githubusercontent.com/open-cluster-management-io/ocm-vscode-extension/main/images/snippets-from-palette.gif
