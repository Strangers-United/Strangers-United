<div id="top"></div>
[![Contributors][contributors-shield]][contributors-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/strangers-united/strangers-united">
    <img src="https://chanceof.xyz/static/chancexyz-4d4020c37f0b72ff17fdb955151e3201.webp" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Strangers United - ETHGlobal Hackathon Project</h3>

  <p align="center">
    We set out to create a chance of DeFi loan liquidation dApp that is powered by a new type of data oracle. We down scoped to a chance of hitting a price target dApp powered by chance-data to simulate the price ranges of a crypto assets for a given day.
    <br />
    <a href="https://chanceof.xyz"><strong>Learn more about chance-data »</strong></a>
    <br />
    <br />
    <a href="https://chanceof.xyz/">View Demo</a>
    ·
    <a href="https://github.com/strangers-united/strangers-united/issues">Report Bug</a>
    ·
    <a href="https://github.com/strangers-united/strangers-united/issues">Request Feature</a>
  </p>
</div>

# Strangers United

`Strangers United` is a project made for the 2021's ETH Global Hackathon.

# Setup

## Smart contract

#### Folder structure

#### **blockchain** -- > `oracle (nodejs server for oracle (OOFNode))` & `smart-contract (whole contracts belong to the project)`

#### Smart-Contract directory requirements:

```
1- npm install @openzeppelin/contracts
```

### Compilation

```
truffle compile
```

### Migration

```
truffle migrate --network {networkName}
```

Get `networkName` from `truffle-config.js`

In this example, the `networkName` is `development`,

```
truffle migrate --network development
```

### Reset

```
truffle migrate --reset
```

### Run

Prefer using `Ganache`, use this command if you don't have `Ganache`

```
truffle development
```

---

## Frontend

### Installation

```
cd client

npm install
```

### Run

```
npm run start
```

---

## Local block chain

### Installation

Install `Ganache`
`npm install -g ganache-cli`
Run `Ganache`
`ganache-cli`

Create a new workspace

### Setup

Make sure the server of your Ganache workspace has the same config as `truffle-config.js`

1. Hostname : 127.0.0.1
2. Port number : 7545
3. Network ID : 1337

### Run

Start by clicking the icon of `Ganache`

---

## Creating chance-data

### Python scripts

```
cd data-prep

python3 fitting-history.py
```
You will want to change the tokens to match those in your wallet. The current pipeline is a manual process. We will be able to automate this process in the future and have crowd sourced data for every possible combination of tokens. Chance-data is currently stored on IPFS using [pinata.cloud](pinata.cloud) but we will move this to [GunDB](gun.eco) in the near future.

[contributors-shield]: https://img.shields.io/github/contributors/strangers-united/strangers-united.svg?style=for-the-badge
[contributors-url]: https://github.com/strangers-united/repo_name/graphs/contributors
