# User Script Builder

A modern CLI toolkit for creating, building and releasing browser UserScripts.

## 🚀 Features

- Build UserScripts automatically
- Generate Tampermonkey metadata
- Bundle project files
- Version management
- Release flow with automatic commit
- Publish automation to GitHub Releases

## 📦 Installation

```bash
npm install
```

## 🔨 Usage

Build your UserScript:

```bash
usb build
```

Create a release and bump the version:

```bash
usb release patch
usb release minor
usb release major
```

This command will:
- update the version in the config
- run the build
- create a Git commit with the new version

Publish the built script to GitHub:

```bash
usb publish
```

This command will:
- validate the Git working tree
- push the current branch to the remote
- create or update a Git tag like `v1.0.1`
- publish a GitHub Release
- upload the built `.user.js` artifact from `dist/`

Draft and prerelease examples:

```bash
usb publish --draft
usb publish --prerelease
usb publish --publish-draft
```

## ⚙️ Requirements

`usb publish` requires:
- a clean Git working tree
- a Git remote named `origin` pointing to GitHub
- one of the following configured for GitHub API access:
  - `GITHUB_TOKEN`
  - `GH_TOKEN`
  - `GITHUB_PAT`
  - or GitHub CLI authentication via `gh auth login`

## 📁 Project Structure

Example:

```text
my-userscript/
├── src/
│   └── index.js
├── dist/
├── userscript.config.json
└── package.json
```

## 🛠 Development

Clone the repository:

```bash
git clone https://github.com/dionesrosa/userscript-builder.git
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## 📄 License

MIT License
