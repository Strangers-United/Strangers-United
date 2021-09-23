# Project Planning and Organization

## The main goal of this project is to: 
Provide a simple, easy-to-use, way of estimating if a portfolio will hit a specific value and if so trigger a specific event like increasing increasing or decreasing the number of tokens in the portfolio.

## The project is organized in the following way:
Three sprints each delivering a working dapp with progressively increasing functionality. This way if the project is not fully developed, the user can still use the dapp in a more limited way.

### Skateboard
[https://notability.com/n/1bY5gWEI036dSSP5UJd6dP](https://notability.com/n/1bY5gWEI036dSSP5UJd6dP)
1. User can import a portfolio via wallet connection - ( pick one integration to start eg metamask, or find library that supports many different wallet providers). Check to see if any sponsors are available with prizes.
    - Consider if User can import a portfolio via contract address instead of wallet connection.
2. Get the current number of tokens in the portfolio. Consider user entry here if there are issues connecting to wallet.
3. Get the current value of the portfolio via oracle - chainlink, conjure, the graph? check prizes
4. Read PRE-MADE historical probability distributions for the top n tokens from IPFS or Conjure custome oracle
    - Assume this is a preprocessed data pipeline that is run off chain
    - Narrowing down the top n tokens (5 for skateboard) is a manual process for now. Maybe based on market cap? or tokens Aave supports something that limits the universe for now.
    - The preprocessed data is will be for daily price data. Think High Low Open Close for each day. Later we can add more data like volume, or hourly or by block...
    - The format of these price distributions AND how they are related to each other (token to token) will be captured as a covariance matrix and stored in a standardized format that preserves the shapes of the distributions and the relationships. 
5. Ask user to choose a tokens from their portfolio (must be from the top N (5) tokens) for dapp to run interactive simulation.
    - This would read the covariance matrix and the historical probability distribution for the chosen tokens. IPFS or Conjure oracle toolkit we use to create our own oracle smart contract. A so called hydration.js will take the distributions and build a monte carlo simulation in browser.
6. Ask user tp indicate a threshold for triggering a specific event. eg what' the chance portfolio decreases and hits liquidation level today.
    - Eventually we add multiple future periods into the simulation (random walk).
7. Calculate the probability of hitting the threshold and display the result.

### Bicycle
- Have dapp request data from our oracle smart contract to get historical data (rather than IFPS)
- Add data viz to dapp so user can see the probability of hitting a certain threshold and interactively simulate hitting a threshold event (like liquidation).
- Add option for user to change portfolio token weights in the portfolio and have that run the simulation.

### eBike
- ?? Build system to process historical data distributions as requested by user after we evaluate what tokens are in their wallet. If token is not in our database already we add it.
- Add random walk to dapp to simulate the probability of hitting a certain threshold. Show time series fan chart of probability of hitting a certain threshold.
- Add option for user to change portfolio rebalance or take action by calling defi smart contract (tdb).


Need some tolegate dates for each sprint and to get team assigned to sprints tasks.

NOTES from discord chats:
It's starting to seem like there will be three maybe 4 parts to the project. 1) Off chain historical data prep, 2) off-chain data onto chain via Conjure?? 3) dapp that calls a few web3 servers and handles user interactions 4) The take action contract

[Conjure](https://docs.oof.conjure.finance/) wouldn't require too much smart contract work as it appears the process for setting up your own oracle (which I'd say we want to do) is 
1) call their formation contract with info about the data feed we want to bring on chain and some details about how we want to get paid by users of our data feed (requires gas but essentially one time), 
2) 2) make feed endpoint settings and run a nodejs service that pulls from our data feeds api and how often (daily, would require gas every time it puts our feed onto the chain) 
3) 3) dapp calls contract to get latest values. 

I think it's interesting but it doesn't necessarily solve for the 'let's get some hands on experience writing sol contracts unless we fork it and customize to support sharing probability distributions instead of single median values like most oracles do. That's actully pretty interesting idea. hmmm
