const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require("node-fetch");
const ethers = require('ethers');
require('dotenv').config()
const ABI = require('./abi/oof.json')
const {Contract} = require("ethers");

// config go to file later
const rpc = process.env.RPC
const pk= process.env.PK
const oofAddress= process.env.OOFAddress
const sheetapi= process.env.SHEETAPI
const sheetid= process.env.SHEETID
const sheettitle= process.env.SHEETTITLE

const provider = new ethers.providers.JsonRpcProvider(rpc);
const walletWithProvider = new ethers.Wallet(pk, provider);

// store the feed inventory
let feedInventory = [];

const oofContract =  !!ABI && !!walletWithProvider
        ? new Contract(oofAddress, ABI, walletWithProvider)
        : undefined;

// start building inventory
async function setupFeeds() {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetid);
    await doc.useApiKey(sheetapi);

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByTitle[sheettitle];

    const rows = await sheet.getRows(); // can pass in { limit, offset }

    console.log("Feeds in google sheet")
    console.log(rows.length-1)

    // get current feed len
    let length = await oofContract.getFeedLength()
    console.log("Found feeds in contract:")
    console.log(length.toNumber())

    let i;

    // start with 1 cause the first 2 lines are non related
    for (i=1+length.toNumber() ; i < rows.length; i++) {
        let feedname = rows[i]["_rawData"][0]
        let feedid= rows[i]["_rawData"][1]
        let endpoint = rows[i]["_rawData"][2]
        let freq = rows[i]["_rawData"][3]
        let decimals = rows[i]["_rawData"][4]
        let parser = rows[i]["_rawData"][5]
        let descriptions = rows[i]["_rawData"][6]
        let parsingargs = []

        try {
            parsingargs = parser.split(",");
        } catch {}

        let tempInv = {
            "feedName": feedname,
            "feedId": feedid,
            "endpoint": endpoint,
            "frequency": freq,
            "decimals": decimals,
            "parsingargs": parsingargs,
            "descriptions": descriptions
        }

        // process into global feed array
        feedInventory.push(tempInv)
    }

    let names = []
    let descriptions=[]
    let decimals = []
    let timeslots = []
    let feedCosts = []
    let revenueModes = []

    let x;
    for (x=0; x < feedInventory.length; x++ ) {
        names.push(feedInventory[x]["feedName"])
        descriptions.push(feedInventory[x]["descriptions"])
        decimals.push(feedInventory[x]["decimals"])
        timeslots.push(feedInventory[x]["frequency"])
        feedCosts.push(0)
        revenueModes.push(0)
    }

    if(feedInventory.length === 0)
    {
        console.log("no feeds to be created...")
    }
    else  {
        console.log("creating feeds...")

        try {
            let tx = await oofContract.createNewFeeds(names,descriptions,decimals,timeslots,feedCosts,revenueModes)
            const {events, cumulativeGasUsed, gasUsed, transactionHash} = await tx.wait();
            console.log(`Cumulative: ${cumulativeGasUsed.toNumber()}`);
            console.log(`Gas: ${gasUsed.toNumber()}`)
            console.log(`hash: ${transactionHash.toString()}`)


            console.log("feeds created")
        } catch (e) {
            console.log(e)
        }
    }
}



//setupContract()
setupFeeds()

