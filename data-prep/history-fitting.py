#https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7
import pandas as pd
from pycoingecko import CoinGeckoAPI
import numpy as np
import matplotlib.pyplot as plt
from PySIP3library import Json
import json
import pandas as pd
from datetime import *
from dateutil.relativedelta import *
NOW = datetime.now()
today = NOW.date()

# Setting up the API
#tokens = cg.get_coins_list()
#print(tokens)
# Pick upto 5 tokens
#tokens = [token1Name]
# tokens = ['bitcoin','ethereum','solana','filecoin','flow']
tokens = ['flow','theta-token','axie-infinity','chiliz','enjincoin']

nakedFileName = '-'.join(str(e) for e in tokens)
# Setup - Pick timeframe (1, 7, 30, 365)
timeFrame = 30
outputFileName = nakedFileName + str('-') + str(today)
outputFileNameJson = outputFileName +'.json'
outputFileNamePng = nakedFileName +'.png'
# Global Variables and initalize
cg = CoinGeckoAPI()
allPriceHistory = []
allCleanedHistory = []
holder = pd.DataFrame()
metadata = []

for i,t in enumerate(tokens):
    #print(i,t)
    allPriceHistory = cg.get_coin_ohlc_by_id(id=t, vs_currency='usd', days=timeFrame)
    #[1594382400000 (time),1.1 (open),2.2 (high),3.3 (low),4.4 (close)] 
    df = pd.DataFrame(allPriceHistory,columns=['UnixEpochMs','Open','High','Low','Close'])
    
    # Set df index as date for agg lambda functions
    df['Date'] = pd.to_datetime(df['UnixEpochMs'],unit='ms')
    df.index = df['Date']
    ohlc_dict = {'Open':'first','High':'max','Low':'min','Close': 'last'}
    # TODO resample rate based on settings, find better data provider TheGraph?
    tokenDailyOHLC = df.resample('1D', closed='left', label='left').apply(ohlc_dict)
    #print(tokenDailyOHLC)
    
    # Calc 24hr % change
    # remove hyphen for chancecalc excel can't handle it in column name
    tokenDailyOHLC[t.replace('-','')]= tokenDailyOHLC['Close'] / tokenDailyOHLC['Close'].shift(1) # TODO VERIFY not in log land
    tokenDailyOHLC.dropna(inplace=True) # drop first row as its NaN
    #print(tokenDailyOHLC)
    
    # Remove unneeded columns
    dfReady = tokenDailyOHLC.drop(['Open', 'High','Low','Close'], axis=1)
    #print(dfReady)

    # Store in a dataframe each token's percentage change
    holder[t.replace('-','')] = dfReady    
 


# Visualize
# scatter plot all tokens
pd.plotting.scatter_matrix(holder, alpha=1)
#plt.savefig('histos/' + outputFileNamePng)

# Build histo images for each token
for i,t in enumerate(tokens):
    #plt.cla()
    #plt.clf()
    holder[t.replace('-','')].plot.hist(bins=10, alpha=1, color='yellow',label=t)
    plt.savefig(t.replace('-','')+'.png',transparent = True)

# Generte sipmath library json    
Json(holder,outputFileNameJson,"KMM",[],'dependent','u',"",4) # use 3 4 or 5 TODO need linear optimization(?) to auto fit
# SIPdata, file_name, author, SIPmetadata = [], dependence = 'independent', boundedness = 'u', bounds = [0, 1], term_saved = 5, seeds = [], setupInputs = []

# Customize Metadata - TODO update metadata before first write?
# open, reference, and read json file, change value, write back to json file
a_file = open(outputFileNameJson, "r")
json_object = json.load(a_file)
a_file.close()
#print(json_object)
json_object.update({'metadata': {'tags': tokens, 'pullTime': json.dumps(NOW, indent=4, sort_keys=True, default=str), 'lastNperiods': timeFrame,'reference': 'https://www.coingecko.com/en/price_charts'}})
a_file = open(outputFileNameJson, "w")
json.dump(json_object, a_file)
a_file.close()
