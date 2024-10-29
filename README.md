# `@jphil/bookwhen-client`

\[wip\]!

An API client library for the [Bookwhen](www.bookwhen.com) booking platform [API (v2)](https://api.bookwhen.com/v2), written in Typescript for NodeJS. Intended for server-side environments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

You'll likely be at least somewhat familiar with the [Bookwhen](www.bookwhen.com) booking platform if you've landed here. But if not, you'll want to have a look at their [API (v2) documentation](https://api.bookwhen.com/v2). There's also a nice [Swagger style layout of the Bookwhen API v2 docs](https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml)

## Features

- Lightweight and easy to integrate
- Fully typed for TypeScript support

## Installation

Install via pnpm:

```bash
pnpm add @jphil/bookwhen-client
```

## Usage

```typescript
// ... todo
```

## Configuration

Required configuration options:

- **apiKey**: Your Bookwhen API key (required)

API requests to the Bookwhen API are authenticated using Basic Authentication with the API Key as the username and a blank password.

API keys can be generated in the [https://YOUR-ACCOUNT-NAME.bookwhen.com/settings/api_access_permission_sets](API tokens setup area of your Bookwhen account).

## Contributing

Contributions are welcome! (proper guidelines to be written)

### Setting Up Husky for Contributions

This project uses Husky for Git hooks and Commitlint to enforce commit message standards.

Install Dependencies: First, clone the repository and install the project dependencies, which include Husky:

```bash
git clone <repository-url>
cd <repository-directory>
pnpm install
```

Activate Husky Hooks: After installing dependencies, you need to initialize Husky's Git hooks. Run the following command:

```bash
pnpm husky install
```

This command sets up a .husky/ directory in the project, linking the necessary scripts to Git’s hook system. Once activated, Husky will automatically enforce commit message standards during commits.

Thank you for helping maintain commit quality and consistency!

## Roadmap

- Keep up with any future changes or additions to the [Bookwhen API](https://api.bookwhen.com/v2).

## License

ISC License. See [LICENSE](LICENSE) for more information.

## Notice

This software is "unofficial" - its development is not affiliated with or funded by Bookwhen.
