# userscript-builder

Ferramenta CLI para criar, compilar e publicar userscripts com metadados prontos para o Tampermonkey.

## 🚀 Recursos

- Compila userscripts automaticamente
- Gera metadados para Tampermonkey
- Organiza a estrutura do projeto
- Gerencia versões com release automático
- Publica builds no GitHub Releases

## 📦 Instalação

```bash
npm install
```

## 🔨 Uso

Para compilar um userscript:

```bash
usb build
```

Criar um release e aumentar a versão:

```bash
usb release patch
usb release minor
usb release major
```

Este comando irá:
- atualizar a versão no arquivo de configuração
- executar o build
- criar um commit Git com a nova versão

Publicar o script gerado no GitHub:

```bash
usb publish
```

Este comando irá:
- validar a árvore de trabalho do Git
- enviar o branch atual para o remoto
- criar ou atualizar uma tag Git no formato `v1.0.1`
- publicar um GitHub Release
- enviar o artefato `.user.js` gerado de `dist/`

Exemplos para draft e prerelease:

```bash
usb publish --draft
usb publish --prerelease
usb publish --publish-draft
```

## ⚙️ Requisitos

Para usar `usb publish` é necessário:
- árvore de trabalho Git limpa (sem alterações pendentes)
- um remoto Git chamado `origin` apontando para o repositório no GitHub
- uma das opções de autenticação para a API do GitHub configurada:
  - `GITHUB_TOKEN`
  - `GH_TOKEN`
  - `GITHUB_PAT`
  - ou autenticação pelo GitHub CLI via `gh auth login`

## 📁 Estrutura do Projeto

Exemplo:

```text
my-userscript/
├── src/
│   └── index.js
├── dist/
├── userscript.config.json
└── package.json
```

## 🛠 Desenvolvimento

Clone o repositório:

```bash
git clone https://github.com/dionesrosa/userscript-builder.git
```

Instale as dependências:

```bash
npm install
```

Execute localmente:

```bash
npm run dev
```

Execute os testes:

```bash
npm test
```

## 📄 Licença

Licença MIT
