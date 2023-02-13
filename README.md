# Open Panda

![Open Panda graph image](static/open-graph-image.jpg)

The repository for the Open Panda application's frontend and backend. Open Panda is a platform for data researchers, analysts, students, and enthusiasts to interact with the largest open datasets in the world, stored on Filecoin's decentralized network.

This is a monorepo with two workspaces, `fe` (frontend) and `be` (backend). It conforms to [npm's workspace architecture](https://docs.npmjs.com/cli/v7/using-npm/workspaces) (available in npm 7+).

The frontend is a collection SSR pages, built with Vue/Nuxt. Data is connected via backend endpoints.

> _Documentation will be expanded upon release_

## Setup

1) Get env and crt files from a development lead (@timelytree or @orvn)

- dpp-mongodb-client.pem
- dpp-ca.crt
- .env (for frontend)
- .env (for backend)

For .env file, make sure to change <username> to your own computer user name

DPP_CA_PATH=/Users/<username>/.ssh/dpp-ca.crt
MONGODB_CLIENT_PEM=/Users/<username>/.ssh/dpp-mongodb-client.pem

2) Add .env file to `/packages/fe`
3) Add .env file to `/packages/be`
4) Run `open ~/.ssh` and add certs (dpp-ca.crt and dpp-mongodb-client.pem)
5) Add Self-signed certificate (see instructions below)


## Build commands

Install

```
npm ci
```

Build Frontend

```
npm run dev-fe
```

Build Backend
```
npm run dev-be
```


## Self-signed certificate

In order to use the site in local development mode, two files must be added to the repo's root directory. The following set of commands apply to a MacOS system, however, if `mkcert` is installed by another package manager, this can be run on any flavor of *nix. 

```zsh
cd ~/.ssh
brew install mkcert ## replace with another package manager for linux distro
mkcert -install
mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
cat localhost_cert.pem > localhost_fullchain.pem
cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
```

Now, navigate to your project directory, wherever the repo was cloned to, for example `cd ~/Sites/work/website` and copy the `pem` files into the repo root. These keys are `.gitignored` by default.

```zsh
cp -v ~/.ssh/localhost_cert.pem ~/.ssh/localhost_key.pem .
```

