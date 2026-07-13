# User Script Builder

A modern CLI toolkit for creating, building and releasing browser UserScripts.

## 🚀 Features

- Build UserScripts automatically
- Generate Tampermonkey metadata
- Bundle project files
- Version management
- Local release flow
- Publish automation (future)

## 📦 Installation

```bash
npm install
````

## 🔨 Usage

Build your UserScript:

```bash
usb build
```

Create a local release:

```bash
usb release patch
usb release minor
usb release major
```

Publish the built script to the configured destination:

```bash
usb publish
```

Draft and prerelease examples:

```bash
usb publish --draft
usb publish --prerelease
usb publish --publish-draft
```

`usb publish` requires:
- a clean Git working tree
- a Git remote named `origin` pointing to GitHub
- `GITHUB_TOKEN` or `GH_TOKEN` set in the environment

It will:
- create a tag like `v1.0.1`
- push the branch and tag
- create a GitHub Release
- upload the built `.user.js` from `dist/`
- publish an existing draft release when `--publish-draft` is used

## 📁 Project Structure

Example:

```
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

Run:

```bash
npm run dev
```

## 📄 License

MIT License
