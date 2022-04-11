# Minimap.js Contribution Guide

Hi! We are really excited that you are interested in contributing to this repository. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Available scripts

### Start

Starts the development server or runs a demo script (e.g. `core` project).

#### Usage

```sh
$ yarn start
```

### Build

Builds static files into the `dist` folder.

#### Usage

```sh
$ yarn build
```

### Test

#### Usage

```sh
yarn test
```

A coverage summary is printed out to the console and an HTML report is generated in `/coverage/lcov-report/index.html`.

### Lint

#### Usage

```sh
yarn lint
```

## Pull Requests

1. Fork the repo.
2. Create a branch from `master`.
3. If you've added code that should be tested, add tests.
4. If you've changed APIs, update the documentation.
5. Run `yarn test` and ensure the test suite passes.
6. PRs must be rebased before merge.
7. PR should be reviewed by at least one maintainer prior to merging.`

You don't need to worry about code style as long as you have installed the dev dependencies – modified files should automatically be formatted with Prettier when committing (via [Git Hooks](https://git-scm.com/docs/githooks)).
