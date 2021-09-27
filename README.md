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
