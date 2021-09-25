# File / Folder Explain

## abis

The abis here are smart contracts compiled by truffle

## components

Reusable or small components are defined inside this folder

## containers

Pages are defined here

## hooks

Customize hooks,

## providers

Define providers here

## reducers

Reducers of redux

## utils

Some common functions / types

## App.tsx

Include all providers here

The "parent" of the whole project

## index.tsx

Entry point of the web app

## Routes.tsx

Define and create all pages / containers here

## store.ts

Define and initialize reducers of redux

---

# Explanation

The web app connects metamask in `NavBar`

If the app is not connected or not activated, only `Loading` will be displayed

And a connect button will be shown in `NavBar`

The store is storing the user's address and connection state of metamask.

We can add more, e.g. token balance or others state that will be accessed by the whole app