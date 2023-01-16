# OpenPanda

## Get files from dev lead (Nauras or Orun)

- dpp-mongodb-client.pem
- .env (for frontend)
- .env (for backend)
- dpp-ca.crt

Make sure to change <nasik> to your own computer user name

DPP_CA_PATH=/Users/<nasik>/.ssh/dpp-ca.crt
MONGODB_CLIENT_PEM=/Users/<nasik>/.ssh/dpp-mongodb-client.pem


## Setup

1) Add .env file to `/packages/be`
2) Add .env file to `/packages/be`
3) Run `open ~/.ssh` and add certs - dpp-ca.crt and dpp-mongodb-client.pem here
4) Add Self-signed certificate (see instructions below)


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

Now, navigate to your project directory, wherever the repo was cloned to, for example `cd ~/Sites/fishbowl/website` and copy the `pem` files into the repo root. These keys are `.gitignored` by default.

```zsh
cp -v ~/.ssh/localhost_cert.pem ~/.ssh/localhost_key.pem .
```
