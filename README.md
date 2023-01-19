# OpenPanda

Monorepo with FE and BE.
Home and single pages are SSR with data coming from BE thru endpoints.

## Setup

1) Get env and crt files from dev lead (Nauras or Orun)

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
