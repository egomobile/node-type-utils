[![npm](https://img.shields.io/npm/v/@egomobile/type-utils.svg)](https://www.npmjs.com/package/@egomobile/type-utils)
[![last build](https://img.shields.io/github/workflow/status/egomobile/node-type-utils/Publish)](https://github.com/egomobile/node-type-utils/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/node-type-utils/pulls)

# @egomobile/type-utils

> TypeScript utilities and helpers.

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/type-utils
```

## Usage

```typescript
import { scanForTypes } from "@egomobile/type-utils";

const dir = "<PATH-TO-THE-ROOT-DIRECTORY-TO-SCAN>";

async function main() {
  const types = await scanForTypes(dir);

  console.log("Loaded types:", types);
}

main().catch(console.error);
```

## Documentation

The API documentation can be found [here](https://egomobile.github.io/node-type-utils/).
